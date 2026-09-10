/**
 * Format number to Indonesian Rupiah currency
 * @param {number|string} amount
 * @returns {string} e.g. "Rp 28.000"
 */
export const formatRupiah = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Safely parse date string to handle UTC timezone and ASP.NET DateTime without Z
 * @param {string|Date} dateString
 * @returns {Date}
 */
export const parseSafeDate = (dateString) => {
  if (!dateString) return new Date();
  if (dateString instanceof Date) return dateString;

  let str = String(dateString).trim();
  // If ISO string without timezone indicator (like "2026-09-10T18:40:00" from ASP.NET DateTime.UtcNow)
  if (str.includes('T') && !str.endsWith('Z') && !str.includes('+') && !str.match(/-\d{2}:\d{2}$/)) {
    str += 'Z';
  }
  const date = new Date(str);
  return isNaN(date.getTime()) ? new Date(dateString) : date;
};

/**
 * Format datetime string into user-friendly Indonesian date
 * @param {string|Date} dateString
 * @returns {string} e.g. "04 Sep 2026, 14:30"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = parseSafeDate(dateString);
  if (isNaN(date.getTime())) return String(dateString);

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

/**
 * Format date only (YYYY-MM-DD)
 * @param {string|Date} dateString
 * @returns {string} e.g. "04 Sep 2026"
 */
export const formatDateOnly = (dateString) => {
  if (!dateString) return '-';
  const date = parseSafeDate(dateString);
  if (isNaN(date.getTime())) return String(dateString);

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Calculate sum of multiple amounts using ES6 Rest Parameter (...values)
 * @param  {...number} values
 * @returns {number}
 */
export const calculateTotalSum = (...values) => {
  return values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
};

/**
 * Combine multiple class names / string labels using ES6 Rest Parameter (...parts)
 * @param  {...string} parts
 * @returns {string}
 */
export const combineLabels = (...parts) => {
  return parts.filter(Boolean).join(' • ');
};
