/**
 * Service for handling JSON Schema validation
 * Provides validation functionality using Ajv (Another JSON Schema Validator)
 * @class ValidationService
 */

const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });

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
      const field =
        error.instancePath.substring(1) || error.params.missingProperty;

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
        default:
          return `Field '${field}' ${error.message}`;
      }
    });
  }
}

module.exports = ValidationService;
