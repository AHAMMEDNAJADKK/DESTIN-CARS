const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
  {
    voucherNumber: {
      type: String,
      required: [true, 'Voucher number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    date: {
      type: Date,
      required: [true, 'Trip date is required'],
      default: Date.now
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      trim: true,
      uppercase: true
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true
    },
    driverPhone: {
      type: String,
      required: [true, 'Driver phone is required'],
      trim: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    customerAddress: {
      type: String,
      trim: true,
      default: ''
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true
    },
    startingLocation: {
      type: String,
      required: [true, 'Starting location is required'],
      trim: true
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true
    },
    startingKM: {
      type: Number,
      required: [true, 'Starting KM is required'],
      min: [0, 'Starting KM cannot be negative']
    },
    closingKM: {
      type: Number,
      required: [true, 'Closing KM is required'],
      min: [0, 'Closing KM cannot be negative']
    },
    totalKM: {
      type: Number,
      required: [true, 'Total KM is required'],
      min: [0, 'Total KM cannot be negative']
    },
    fromTime: {
      type: String,
      required: [true, 'From time is required'],
      trim: true
    },
    toTime: {
      type: String,
      required: [true, 'To time is required'],
      trim: true
    },
    totalHours: {
      type: String,
      required: [true, 'Total hours is required'],
      trim: true
    },
    taxiCharges: {
      type: Number,
      required: [true, 'Taxi charges are required'],
      min: [0, 'Taxi charges cannot be negative'],
      default: 0
    },
    tollParking: {
      type: Number,
      min: [0, 'Toll / Parking cannot be negative'],
      default: 0
    },
    nightBata: {
      type: Number,
      min: [0, 'Night Bata cannot be negative'],
      default: 0
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    advance: {
      type: Number,
      min: [0, 'Advance amount cannot be negative'],
      default: 0
    },
    balance: {
      type: Number,
      required: [true, 'Balance amount is required']
    },
    guestSignature: {
      type: String,
      default: ''
    },
    driverSignature: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound index for quick searching
voucherSchema.index({ customerName: 'text', vehicleNumber: 'text', voucherNumber: 'text' });

module.exports = mongoose.model('Voucher', voucherSchema);
