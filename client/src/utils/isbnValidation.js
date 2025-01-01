/**
 * Validates ISBN-10 checksum
 * @param {string} isbn - ISBN-10 string without hyphens
 * @returns {boolean} True if checksum is valid
 */
const validateIsbn10 = (isbn) => {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * parseInt(isbn[i]);
  }
  const checkDigit = isbn[9].toUpperCase();
  sum += checkDigit === "X" ? 10 : parseInt(checkDigit);
  return sum % 11 === 0;
};

/**
 * Validates ISBN-13 checksum
 * @param {string} isbn - ISBN-13 string without hyphens
 * @returns {boolean} True if checksum is valid
 */
const validateIsbn13 = (isbn) => {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn[i]);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(isbn[12]);
};

/**
 * Validates ISBN format and checksum
 * @param {string} isbn - ISBN string (can include hyphens)
 * @returns {boolean} True if ISBN is valid or empty
 */
const validateIsbn = (isbn) => {
  if (!isbn) return true;
  // Remove hyphens
  const cleanIsbn = isbn.replace(/-/g, "");

  // Basic format validation
  if (!/^(?:\d{9}[\dX]|\d{13})$/.test(cleanIsbn)) {
    return false;
  }

  // Checksum validation
  if (cleanIsbn.length === 10) {
    return validateIsbn10(cleanIsbn);
  }
  if (cleanIsbn.length === 13) {
    return validateIsbn13(cleanIsbn);
  }
  return false;
};

export { validateIsbn, validateIsbn10, validateIsbn13 };
