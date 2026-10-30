const Voucher = require('../models/Voucher');
const Counter = require('../models/Counter');

/**
 * Generate the next sequential voucher number
 * Format: DC-YYYY-XXXX (e.g. DC-2026-0001)
 */
const getNextVoucherNumber = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const counterId = `voucher_${currentYear}`;

    // Find the latest counter or latest voucher to initialize counter accurately
    let counter = await Counter.findOne({ id: counterId });
    if (!counter) {
      // Check existing vouchers in DB for this year to prevent duplicates if DB was partially seeded
      const yearPrefix = `DC-${currentYear}-`;
      const latestVoucher = await Voucher.findOne({
        voucherNumber: { $regex: `^${yearPrefix}` }
      }).sort({ voucherNumber: -1 });

      let initialSeq = 0;
      if (latestVoucher && latestVoucher.voucherNumber) {
        const parts = latestVoucher.voucherNumber.split('-');
        if (parts.length === 3 && !isNaN(Number(parts[2]))) {
          initialSeq = parseInt(parts[2], 10);
        }
      }
      counter = await Counter.create({ id: counterId, seq: initialSeq });
    }

    const nextSeq = counter.seq + 1;
    const padded = String(nextSeq).padStart(4, '0');
    const nextVoucherNumber = `DC-${currentYear}-${padded}`;

    res.status(200).json({
      success: true,
      voucherNumber: nextVoucherNumber
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new voucher
 */
const createVoucher = async (req, res, next) => {
  try {
    const { voucherNumber } = req.body;

    // Check if voucherNumber exists
    const existing = await Voucher.findOne({ voucherNumber });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Voucher number ${voucherNumber} already exists. Please use a unique number.`
      });
    }

    const voucher = await Voucher.create(req.body);

    // If voucher follows DC-YYYY-XXXX format, advance the counter
    const currentYear = new Date().getFullYear();
    const parts = voucherNumber.split('-');
    if (parts.length === 3 && parts[0] === 'DC' && !isNaN(Number(parts[2]))) {
      const seq = parseInt(parts[2], 10);
      const counterId = `voucher_${parts[1] || currentYear}`;
      await Counter.findOneAndUpdate(
        { id: counterId, seq: { $lt: seq } },
        { $set: { seq } },
        { upsert: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Trip voucher created successfully',
      data: voucher
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all vouchers with search and date filtering
 */
const getVouchers = async (req, res, next) => {
  try {
    const { search, date, startDate, endDate, page = 1, limit = 50 } = req.query;

    const query = {};

    // Search query across Voucher Number, Customer Name, and Vehicle Number
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { voucherNumber: regex },
        { customerName: regex },
        { vehicleNumber: regex },
        { driverName: regex },
        { customerPhone: regex }
      ];
    }

    // Date filtering
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(new Date(startDate).setHours(0, 0, 0, 0));
      }
      if (endDate) {
        query.date.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [vouchers, total] = await Promise.all([
      Voucher.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Voucher.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: vouchers.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: vouchers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single voucher by ID
 */
const getVoucherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let voucher;

    // Check if id is valid mongo id, or try finding by voucherNumber
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      voucher = await Voucher.findById(id);
    } else {
      voucher = await Voucher.findOne({ voucherNumber: id.toUpperCase() });
    }

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: `Voucher not found with identifier: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: voucher
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing voucher
 */
const updateVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { voucherNumber } = req.body;

    const existingVoucher = await Voucher.findById(id);
    if (!existingVoucher) {
      return res.status(404).json({
        success: false,
        message: `Voucher not found with ID ${id}`
      });
    }

    // If voucherNumber is being changed, ensure it doesn't collide with another record
    if (voucherNumber && voucherNumber !== existingVoucher.voucherNumber) {
      const duplicate = await Voucher.findOne({
        voucherNumber,
        _id: { $ne: id }
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Voucher number ${voucherNumber} already exists on another voucher.`
        });
      }
    }

    const updated = await Voucher.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Trip voucher updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a voucher
 */
const deleteVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findByIdAndDelete(id);

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: `Voucher not found with ID ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Voucher deleted successfully',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNextVoucherNumber,
  createVoucher,
  getVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher
};
