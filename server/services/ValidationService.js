const Ajv = require("ajv");

/**
 * @class ValidationService
 * @description Service for validating data against a schema
 */
class ValidationService {
  constructor() {
    this.ajv = new Ajv();
  }

  /**
   * @method validate
   * @description Validates data against a schema
   * @param {Object} schema - The schema to validate against
   * @param {Object} data - The data to validate
   * @returns {Object} - The result of the validation
   */
  validate(schema, data) {
    const valid = this.ajv.validate(schema, data);
    if (!valid) {
      return {
        valid: false,
        errors: {
          code: "dtoInIsNotValid",
          message: "The input data is not valid",
          validationErrors: this.ajv.errors,
        },
      };
    }
    return { valid: true };
  }
}

module.exports = ValidationService;
