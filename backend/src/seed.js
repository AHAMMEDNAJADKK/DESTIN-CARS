const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Voucher = require('./models/Voucher');
const Counter = require('./models/Counter');

dotenv.config({ path: __dirname + '/../.env' });

const seedSampleVoucher = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/destin_cabs');
    console.log('[Seed] Connected to MongoDB');

    // Check if sample voucher already exists
    const existing = await Voucher.findOne({ voucherNumber: 'DC-2026-0001' });
    if (!existing) {
      await Voucher.create({
        voucherNumber: 'DC-2026-0001',
        date: new Date(),
        vehicleNumber: 'KL 07 CD 7788',
        driverName: 'Muhammed Shafi',
        driverPhone: '9526886600',
        customerName: 'Robert Langdon',
        customerAddress: 'Room 402, Vivanta Marine Drive, Kochi',
        customerPhone: '9846012345',
        startingLocation: 'Cochin International Airport (COK)',
        destination: 'Kumarakom Lake Resort, Kottayam',
        startingKM: 24500,
        closingKM: 24585,
        totalKM: 85,
        fromTime: '09:00',
        toTime: '13:30',
        totalHours: '4 hrs 30 mins',
        taxiCharges: 3200,
        tollParking: 180,
        nightBata: 0,
        totalAmount: 3380,
        advance: 1000,
        balance: 2380,
        guestSignature: '',
        driverSignature: ''
      });
      console.log('[Seed] Sample voucher DC-2026-0001 created.');
    } else {
      console.log('[Seed] Sample voucher already present.');
    }

    // Ensure counter is updated
    await Counter.findOneAndUpdate(
      { id: 'voucher_2026' },
      { $max: { seq: 1 } },
      { upsert: true }
    );

    console.log('[Seed] Done');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedSampleVoucher();
