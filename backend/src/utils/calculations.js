/**
 * Calculation and validation utilities for Destin Cabs Voucher System
 */

const calculateTotalKM = (startingKM, closingKM) => {
  if (
    startingKM === '' ||
    closingKM === '' ||
    startingKM === null ||
    closingKM === null ||
    startingKM === undefined ||
    closingKM === undefined
  ) {
    throw new Error('Starting KM and Closing KM must be valid numbers');
  }
  const start = Number(startingKM);
  const close = Number(closingKM);
  if (isNaN(start) || isNaN(close)) {
    throw new Error('Starting KM and Closing KM must be valid numbers');
  }
  if (close < start) {
    throw new Error('Closing KM cannot be less than Starting KM');
  }
  return Math.round((close - start) * 100) / 100;
};

const calculateTotalAmount = (taxiCharges = 0, tollParking = 0, nightBata = 0) => {
  const taxi = Number(taxiCharges) || 0;
  const toll = Number(tollParking) || 0;
  const bata = Number(nightBata) || 0;

  if (taxi < 0 || toll < 0 || bata < 0) {
    throw new Error('Charge amounts cannot be negative');
  }
  return Math.round((taxi + toll + bata) * 100) / 100;
};

const calculateBalance = (totalAmount, advance = 0) => {
  const total = Number(totalAmount) || 0;
  const adv = Number(advance) || 0;

  if (adv < 0) {
    throw new Error('Advance amount cannot be negative');
  }
  return Math.round((total - adv) * 100) / 100;
};

const calculateDuration = (fromTime, toTime) => {
  if (!fromTime || !toTime) return { formatted: '', totalMinutes: 0 };

  const [fromH, fromM] = fromTime.split(':').map(Number);
  const [toH, toM] = toTime.split(':').map(Number);

  if (
    isNaN(fromH) || isNaN(fromM) ||
    isNaN(toH) || isNaN(toM) ||
    fromH < 0 || fromH > 23 || fromM < 0 || fromM > 59 ||
    toH < 0 || toH > 23 || toM < 0 || toM > 59
  ) {
    throw new Error('Invalid time format. Expected HH:mm');
  }

  let startMinutes = fromH * 60 + fromM;
  let endMinutes = toH * 60 + toM;

  // Handle midnight crossing: if end time is earlier than start time, trip crossed midnight
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  const diffMinutes = endMinutes - startMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  let formatted = '';
  if (hours > 0 && minutes > 0) {
    formatted = `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    formatted = `${hours} hr${hours > 1 ? 's' : ''}`;
  } else {
    formatted = `${minutes} min${minutes > 1 ? 's' : ''}`;
  }

  return {
    hours,
    minutes,
    totalMinutes: diffMinutes,
    formatted
  };
};

const isValidIndianPhone = (phone) => {
  if (!phone) return false;
  const cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, '');
  // Matches +91 followed by 10 digits starting with 6-9, or bare 10 digits starting with 6-9
  return /^(\+91)?[6-9]\d{9}$/.test(cleanPhone);
};

module.exports = {
  calculateTotalKM,
  calculateTotalAmount,
  calculateBalance,
  calculateDuration,
  isValidIndianPhone
};
