/**
 * Service for standardized response handling across the application
 * Provides methods for handling different types of responses and sending appropriate HTTP responses
 */
const ErrorCodes = require("../constants/ErrorCodes");

class ResponseHandlingService {
  /**
   * Handles successful responses
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {number} [status=200] - HTTP status code
   */
  static handleSuccess(res, data, status = 200) {
    return res.status(status).json({
      status: "success",
      data
    });
  }

  /**
   * Handles validation errors
   * @param {Object} res - Express response object
   * @param {Array} errors - Array of validation error messages
   */
  static handleValidationError(res, errors) {
    return res.status(400).json({
      status: "error",
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Invalid input data",
        details: errors
      }
    });
  }

  /**
   * Handles business logic errors
   * @param {Object} res - Express response object
   * @param {string} code - Error code from ErrorCodes
   * @param {string} message - Human-readable error message
   */
  static handleBusinessError(res, code, message) {
    return res.status(400).json({
      status: "error",
      error: {
        code,
        message
      }
    });
  }

  /**
   * Handles not found errors
   * @param {Object} res - Express response object
   * @param {string} entity - Name of the entity that wasn't found
   * @param {string} id - ID of the entity that wasn't found
   */
  static handleNotFound(res, entity, id) {
    return res.status(404).json({
      status: "error",
      error: {
        code: ErrorCodes.NOT_FOUND,
        message: `${entity} with id '${id}' not found`
      }
    });
  }

  /**
   * Handles unexpected server errors
   * @param {Object} res - Express response object
   * @param {Error} error - Error object containing details about the server error
   */
  static handleServerError(res, error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      status: "error",
      error: {
        code: error.code || ErrorCodes.STORAGE_CREATE_FAILED,
        message: error.message || "An unexpected error occurred"
      }
    });
  }
}

module.exports = ResponseHandlingService;
