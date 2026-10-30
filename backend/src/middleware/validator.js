const {
  calculateTotalKM,
  calculateTotalAmount,
  calculateBalance,
  calculateDuration,
  isValidIndianPhone
} = require('../utils/calculations');

const validateVoucherInput = (req, res, next) => {
  try {
    const {
      voucherNumber,
      date,
      vehicleNumber,
      driverName,
      driverPhone,
      customerName,
      customerPhone,
      startingLocation,
      destination,
      startingKM,
      closingKM,
      fromTime,
      toTime,
      taxiCharges,
      tollParking,
      nightBata,
      advance
    } = req.body;

    const errors = [];

    // Check required strings
    if (!voucherNumber || !voucherNumber.trim()) {
      errors.push('Voucher number is required');
    }
    if (!date) {
      errors.push('Date is required');
    }
    if (!vehicleNumber || !vehicleNumber.trim()) {
      errors.push('Vehicle number is required');
    }
    if (!driverName || !driverName.trim()) {
      errors.push('Driver name is required');
    }
    if (!driverPhone || !driverPhone.trim()) {
      errors.push('Driver phone is required');
    } else if (!isValidIndianPhone(driverPhone)) {
      errors.push('Driver phone must be a valid 10-digit Indian mobile number');
    }
    if (!customerName || !customerName.trim()) {
      errors.push('Customer name is required');
    }
    if (!customerPhone || !customerPhone.trim()) {
      errors.push('Customer phone is required');
    } else if (!isValidIndianPhone(customerPhone)) {
      errors.push('Customer phone must be a valid 10-digit Indian mobile number');
    }
    if (!startingLocation || !startingLocation.trim()) {
      errors.push('Starting location is required');
    }
    if (!destination || !destination.trim()) {
      errors.push('Destination is required');
    }

    // Starting and Closing KM
    if (startingKM === undefined || startingKM === null || startingKM === '') {
      errors.push('Starting KM is required');
    } else if (Number(startingKM) < 0) {
      errors.push('Starting KM cannot be negative');
    }

    if (closingKM === undefined || closingKM === null || closingKM === '') {
      errors.push('Closing KM is required');
    } else if (Number(closingKM) < 0) {
      errors.push('Closing KM cannot be negative');
    } else if (Number(closingKM) < Number(startingKM)) {
      errors.push('Closing KM cannot be less than Starting KM');
    }

    // Time validation
    if (!fromTime || !fromTime.trim()) {
      errors.push('From time is required');
    }
    if (!toTime || !toTime.trim()) {
      errors.push('To time is required');
    }

    // Charges validation
    if (taxiCharges === undefined || taxiCharges === null || taxiCharges === '') {
      errors.push('Taxi charges are required');
    } else if (Number(taxiCharges) < 0) {
      errors.push('Taxi charges cannot be negative');
    }

    if (tollParking !== undefined && Number(tollParking) < 0) {
      errors.push('Toll / Parking cannot be negative');
    }
    if (nightBata !== undefined && Number(nightBata) < 0) {
      errors.push('Night Bata cannot be negative');
    }
    if (advance !== undefined && Number(advance) < 0) {
      errors.push('Advance amount cannot be negative');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Backend independent recalculation of values
    const recalculatedTotalKM = calculateTotalKM(startingKM, closingKM);
    const duration = calculateDuration(fromTime, toTime);
    const recalculatedTotal = calculateTotalAmount(taxiCharges, tollParking || 0, nightBata || 0);
    const recalculatedBalance = calculateBalance(recalculatedTotal, advance || 0);

    // Overwrite client calculated fields with trustworthy server-side calculations
    req.body.totalKM = recalculatedTotalKM;
    req.body.totalHours = duration.formatted || '0 hr';
    req.body.totalAmount = recalculatedTotal;
    req.body.balance = recalculatedBalance;
    req.body.tollParking = Number(tollParking) || 0;
    req.body.nightBata = Number(nightBata) || 0;
    req.body.advance = Number(advance) || 0;
    req.body.voucherNumber = voucherNumber.trim().toUpperCase();
    req.body.vehicleNumber = vehicleNumber.trim().toUpperCase();

    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  validateVoucherInput
};
