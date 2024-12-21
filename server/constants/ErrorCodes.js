/**
 * Centralized error codes for the application
 * @const {Object} ErrorCodes
 */
const ErrorCodes = {
  // Validation Errors (400)
  VALIDATION_ERROR: "validationError",
  INVALID_INPUT: "invalidInput",

  // Business Logic Errors (400)
  ISBN_EXISTS: "isbnAlreadyExists",
  PAGES_EXCEED_LIMIT: "readPagesExceedsLeftPages",

  // Not Found Errors (404)
  BOOK_NOT_FOUND: "bookNotFound",
  READING_RECORD_NOT_FOUND: "readingRecordNotFound",

  // Storage Errors (500)
  STORAGE_CREATE_FAILED: "failedToCreate",
  STORAGE_READ_FAILED: "failedToRead",
  STORAGE_UPDATE_FAILED: "failedToUpdate",
  STORAGE_DELETE_FAILED: "failedToDelete",
  STORAGE_LIST_FAILED: "failedToList",

  // Entity-specific Errors
  BOOK_CREATE_FAILED: "failedToCreateBook",
  BOOK_UPDATE_FAILED: "failedToUpdateBook",
  READING_RECORD_CREATE_FAILED: "failedToCreateReadingRecord",
  READING_RECORD_UPDATE_FAILED: "failedToUpdateReadingRecord",
};

module.exports = ErrorCodes;
