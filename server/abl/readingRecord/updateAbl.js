/**
 * Application Business Layer for updating reading records
 * Handles validation, business logic, and storage operations for reading record updates
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

/**
 * Validation schema for reading record updates
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "Unique identifier of the reading record",
    },
    readPages: {
      type: "integer",
      minimum: 1,
      description: "Number of pages read in this session",
    },
    readingTime: {
      type: "string",
      pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
      description: "Time spent reading in HH:mm format (24-hour)",
    },
    date: {
      type: "string",
      format: "date",
      description: "Date of reading in DD/MM/YYYY format",
    },
    note: {
      type: "string",
      maxLength: 500,
      description: "Optional notes about the reading session",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

/**
 * Updates an existing reading record and manages associated book's read pages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateAbl(req, res) {
  let originalBook = null;
  let originalRecord = null;

  try {
    const readingRecord = req.body;

    // Input Validation
    const validation = validationService.validate(schema, readingRecord);
    if (!validation.valid) {
      return ResponseHandlingService.handleValidationError(
        res,
        validation.errors
      );
    }

    // Get and validate existing record
    originalRecord = readingRecordDao.get(readingRecord.id);
    if (!originalRecord) {
      return ResponseHandlingService.handleNotFound(
        res,
        "ReadingRecord",
        readingRecord.id
      );
    }

    // Get and validate associated book
    originalBook = bookDao.get(originalRecord.bookId);
    if (!originalBook) {
      return ResponseHandlingService.handleNotFound(
        res,
        "Book",
        originalRecord.bookId
      );
    }

    // If updating pages, validate and prepare updates
    if (readingRecord.readPages) {
      const totalPagesWithoutThisRecord =
        originalBook.pagesRead - originalRecord.readPages;
      const newPagesRead =
        totalPagesWithoutThisRecord + readingRecord.readPages;

      // Validate page count
      if (
        readingRecord.readPages >
        originalBook.numberOfPages - totalPagesWithoutThisRecord
      ) {
        return ResponseHandlingService.handleBusinessError(
          res,
          "readPagesExceedsLeftPages",
          "Read pages exceed the number of left pages in the book"
        );
      }

      try {
        // Start atomic operation

        // 1. Update reading record first
        const updatedRecord = readingRecordDao.update({
          ...originalRecord,
          ...readingRecord,
        });

        // 2. Update book's pages and status
        const updatedBook = bookDao.update({
          ...originalBook,
          pagesRead: newPagesRead,
          finished: newPagesRead >= originalBook.numberOfPages,
        });

        // If we got here, both operations succeeded
        return ResponseHandlingService.handleSuccess(res, updatedRecord);
      } catch (error) {
        // If any operation failed, try to rollback
        try {
          if (updatedRecord) {
            // Rollback reading record update
            readingRecordDao.update(originalRecord);
          }
          if (updatedBook) {
            // Rollback book update
            bookDao.update(originalBook);
          }
        } catch (rollbackError) {
          console.error("Rollback failed:", rollbackError);
        }
        throw error;
      }
    } else {
      // If not updating pages, just update the reading record
      const updatedRecord = readingRecordDao.update({
        ...originalRecord,
        ...readingRecord,
      });
      return ResponseHandlingService.handleSuccess(res, updatedRecord);
    }
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = updateAbl;
