const ErrorCodes = require("../constants/ErrorCodes");

/**
 * Service for standardized error handling across the application
 * Provides methods for handling different types of errors and sending appropriate HTTP responses
 * @class ErrorHandlingService
 */
class ErrorHandlingService {
  /**
   * Handles validation errors
   * @param {Object} res - Express response object
   * @param {Array} errors - Array of validation error messages
   * @returns {Object} HTTP 400 response with validation errors
   */
  static handleValidationError(res, errors) {
    return res.status(400).json({
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Invalid input data",
        details: errors,
      },
    });
  }

  /**
   * Handles business logic errors
   * @param {Object} res - Express response object
   * @param {string} code - Error code from ErrorCodes
   * @param {string} message - Human-readable error message
   * @returns {Object} HTTP 400 response with business error details
   */
  static handleBusinessError(res, code, message) {
    return res.status(400).json({
      error: {
        code,
        message,
      },
    });
  }

  /**
   * Handles not found errors
   * @param {Object} res - Express response object
   * @param {string} entity - Name of the entity that wasn't found
   * @param {string} id - ID of the entity that wasn't found
   * @returns {Object} HTTP 404 response with not found details
   */
  static handleNotFound(res, entity, id) {
    return res.status(404).json({
      error: {
        code: ErrorCodes.NOT_FOUND,
        message: `${entity} with id '${id}' not found`,
      },
    });
  }

  /**
   * Handles unexpected server errors
   * @param {Object} res - Express response object
   * @param {Error} error - Error object containing details about the server error
   * @returns {Object} HTTP 500 response with error details
   */
  static handleServerError(res, error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      error: {
        code: error.code || ErrorCodes.STORAGE_CREATE_FAILED,
        message: error.message || "An unexpected error occurred",
      },
    });
  }
}

module.exports = ErrorHandlingService;
