/**
 * Service for handling JSON Schema validation
 * Provides validation functionality using Ajv (Another JSON Schema Validator)
 * @class ValidationService
 */

const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({
  allErrors: true,
  messages: true,
});
addFormats(ajv);

/**
 * Validates ISBN-10 checksum
 * @param {string} isbn - ISBN-10 string without hyphens
 * @returns {boolean} True if checksum is valid
 */
function validateIsbn10(isbn) {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * parseInt(isbn[i]);
  }
  const checkDigit = isbn[9].toUpperCase();
  sum += (checkDigit === "X") ? 10 : parseInt(checkDigit);
  return sum % 11 === 0;
}

/**
 * Validates ISBN-13 checksum
 * @param {string} isbn - ISBN-13 string without hyphens
 * @returns {boolean} True if checksum is valid
 */
function validateIsbn13(isbn) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn[i]);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(isbn[12]);
}

// Add custom ISBN format
ajv.addFormat("isbn", {
  validate: (isbn) => {
    if (!isbn) return false;
    // Remove hyphens
    const cleanIsbn = isbn.replace(/-/g, "");

    // Validate ISBN-10
    if (cleanIsbn.length === 10) {
      return validateIsbn10(cleanIsbn);
    }
    // Validate ISBN-13
    if (cleanIsbn.length === 13) {
      return validateIsbn13(cleanIsbn);
    }
    return false;
  },
  errors: true
});

// Override the default 'date' format with custom validation and error message
ajv.addFormat("date", {
  validate: (dateStr) => {
    if (!dateStr) return false;

    // Check format DD/MM/YYYY
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return false;
    }

    const [day, month, year] = dateStr.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate instanceof Date && !isNaN(inputDate) && inputDate <= today;
  },
});

// Add custom readingTime format
ajv.addFormat("readingTime", {
  validate: (timeStr) => {
    if (!timeStr) return false;

    // Check format HH:mm
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
      return false;
    }

    // Check if total minutes don't exceed 24 hours
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours * 60 + minutes) <= 24 * 60;
  },
  errors: true
});

class ValidationService {
  /**
   * Validates data against a JSON Schema
   * @param {Object} schema - JSON Schema definition
   * @param {Object} data - Data to validate
   * @returns {Object} Validation result with valid flag and any errors
   */
  validate(schema, data) {
    const validate = ajv.compile(schema);
    const valid = validate(data);

    return {
      valid,
      errors: !valid ? this._formatErrors(validate.errors) : [],
    };
  }

  /**
   * Formats validation errors into a more readable structure
   * @private
   * @param {Array} errors - Raw validation errors from Ajv
   * @returns {Array} Formatted error messages
   */
  _formatErrors(errors) {
    return errors.map((error) => {
      const field = error.instancePath.substring(1) || error.params.missingProperty;

      switch (error.keyword) {
        case "required":
          return `Field '${field}' is required`;
        case "type":
          return `Field '${field}' must be of type ${error.params.type}`;
        case "minLength":
          return `Field '${field}' must be at least ${error.params.limit} characters long`;
        case "maxLength":
          return `Field '${field}' must not exceed ${error.params.limit} characters`;
        case "minimum":
          return `Field '${field}' must be greater than or equal to ${error.params.limit}`;
        case "maximum":
          return `Field '${field}' must be less than or equal to ${error.params.limit}`;
        case "pattern":
          return `Field '${field}' has invalid format`;
        case "format":
          switch (error.params.format) {
            case "date":
              return `Date must be in DD/MM/YYYY format and cannot be in the future`;
            case "isbn":
              return `Invalid ISBN format or checksum`;
            case "readingTime":
              return `Reading time must be in HH:mm format and cannot exceed 24 hours`;
            default:
              return `Field '${field}' ${error.message}`;
          }
        default:
          return `Field '${field}' ${error.message}`;
      }
    });
  }
}

module.exports = ValidationService;
