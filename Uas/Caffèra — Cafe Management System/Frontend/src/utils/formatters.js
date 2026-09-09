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
 * Format datetime string into user-friendly Indonesian date
 * @param {string|Date} dateString
 * @returns {string} e.g. "04 Sep 2026, 14:30"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
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
  const date = new Date(dateString);
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
