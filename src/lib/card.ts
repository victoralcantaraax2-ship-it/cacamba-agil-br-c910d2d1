// BIN detection for card brands
export type CardBrand = 'visa' | 'mastercard' | 'elo' | 'amex' | 'hipercard' | 'diners' | 'discover' | 'unknown';

export const detectBrand = (number: string): CardBrand => {
  const digits = number.replace(/\D/g, '');
  if (!digits) return 'unknown';

  // Elo (before Visa/Master as some overlap)
  const eloRanges = /^(636368|438935|504175|451416|636297|5067|4576|4011|506699|509\d{3}|650\d{3}|651\d{3}|6516|6550)/;
  if (eloRanges.test(digits)) return 'elo';

  // Amex
  if (/^3[47]/.test(digits)) return 'amex';

  // Hipercard
  if (/^(606282|3841)/.test(digits)) return 'hipercard';

  // Diners
  if (/^(36|30[0-5])/.test(digits)) return 'diners';

  // Discover
  if (/^(6011|65|64[4-9])/.test(digits)) return 'discover';

  // Mastercard
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';

  // Visa
  if (/^4/.test(digits)) return 'visa';

  return 'unknown';
};

export const brandNames: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  elo: 'Elo',
  amex: 'American Express',
  hipercard: 'Hipercard',
  diners: 'Diners',
  discover: 'Discover',
  unknown: '',
};

export const brandColors: Record<CardBrand, { bg: string; accent: string }> = {
  visa: { bg: 'from-blue-800 to-blue-600', accent: 'text-white' },
  mastercard: { bg: 'from-gray-800 to-gray-600', accent: 'text-white' },
  elo: { bg: 'from-yellow-600 to-yellow-500', accent: 'text-black' },
  amex: { bg: 'from-sky-700 to-sky-500', accent: 'text-white' },
  hipercard: { bg: 'from-red-700 to-red-500', accent: 'text-white' },
  diners: { bg: 'from-slate-700 to-slate-500', accent: 'text-white' },
  discover: { bg: 'from-orange-600 to-orange-400', accent: 'text-white' },
  unknown: { bg: 'from-emerald-700 to-emerald-500', accent: 'text-white' },
};

// Luhn algorithm
export const validateLuhn = (number: string): boolean => {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : digits;
};

export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};
