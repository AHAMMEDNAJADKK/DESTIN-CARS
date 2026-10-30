/**
 * Client-side calculation utilities for Destin Cabs
 * Uses integer paise to ensure zero floating-point rounding errors.
 */

const toPaise = (amount) => Math.round((parseFloat(amount) || 0) * 100);
const toRupees = (paise) => Math.round(paise) / 100;

export const calculateTotalKM = (startingKM, closingKM) => {
  if (
    startingKM === '' ||
    closingKM === '' ||
    startingKM === null ||
    closingKM === null ||
    startingKM === undefined ||
    closingKM === undefined
  ) {
    return 0;
  }
  const start = parseFloat(startingKM);
  const close = parseFloat(closingKM);
  if (isNaN(start) || isNaN(close)) return 0;
  if (close < start) return 0;
  return Math.round((close - start) * 100) / 100;
};

export const calculateTotalAmount = (taxiCharges, tollParking, nightBata) => {
  const taxi = parseFloat(taxiCharges) || 0;
  const toll = parseFloat(tollParking) || 0;
  const bata = parseFloat(nightBata) || 0;
  return toRupees(toPaise(taxi) + toPaise(toll) + toPaise(bata));
};

export const calculateBalance = (totalAmount, advance) => {
  const total = parseFloat(totalAmount) || 0;
  const adv = parseFloat(advance) || 0;
  return toRupees(toPaise(total) - toPaise(adv));
};

export const calculateDuration = (fromTime, toTime) => {
  if (!fromTime || !toTime) return { formatted: '', hours: 0, minutes: 0, totalMinutes: 0 };

  const [fromH, fromM] = fromTime.split(':').map(Number);
  const [toH, toM] = toTime.split(':').map(Number);

  if (
    isNaN(fromH) || isNaN(fromM) ||
    isNaN(toH) || isNaN(toM) ||
    fromH < 0 || fromH > 23 || fromM < 0 || fromM > 59 ||
    toH < 0 || toH > 23 || toM < 0 || toM > 59
  ) {
    return { formatted: '', hours: 0, minutes: 0, totalMinutes: 0 };
  }

  let startMinutes = fromH * 60 + fromM;
  let endMinutes = toH * 60 + toM;

  // Overnight journeys (crossing midnight)
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

export const isValidIndianPhone = (phone) => {
  if (!phone) return false;
  const cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleanPhone);
};
