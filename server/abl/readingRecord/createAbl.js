/**
 * Application Business Layer for creating reading records
 * Handles validation, business logic, and storage operations for new reading records
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

/**
 * Validation schema for reading record creation
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    bookId: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "ID of the book this record belongs to",
    },
    readPages: {
      type: "integer",
      minimum: 1,
      description: "Number of pages read in this session",
    },
    readingTime: {
      type: "string",
      format: "readingTime",
      description: "Time spent reading in HH:mm format (24-hour, max 24 hours)",
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
  required: ["bookId", "readPages", "readingTime", "date"],
  additionalProperties: false,
};

/**
 * Creates a new reading record and updates associated book's read pages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createAbl(req, res) {
  let createdRecord = null;
  let originalBook = null;
  let updatedBook = null;

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

    // Get and validate book
    originalBook = bookDao.get(readingRecord.bookId);
    if (!originalBook) {
      return ResponseHandlingService.handleNotFound(
        res,
        "Book",
        readingRecord.bookId
      );
    }

    // Validate page count
    if (
      readingRecord.readPages >
      originalBook.numberOfPages - originalBook.pagesRead
    ) {
      return ResponseHandlingService.handleBusinessError(
        res,
        "readPagesExceedsLeftPages",
        "Read pages exceed the number of left pages in the book"
      );
    }

    try {
      // Start atomic operation

      // 1. Create reading record
      createdRecord = readingRecordDao.create(readingRecord);

      // 2. Update book's pages and status
      const newPagesRead = originalBook.pagesRead + readingRecord.readPages;
      updatedBook = bookDao.update({
        ...originalBook,
        pagesRead: newPagesRead,
        finished: newPagesRead >= originalBook.numberOfPages,
      });

      // If we got here, both operations succeeded
      return ResponseHandlingService.handleSuccess(
        res,
        createdRecord,
        "Reading record created successfully"
      );
    } catch (error) {
      // If any operation failed, try to rollback
      try {
        if (createdRecord) {
          // Rollback reading record creation
          readingRecordDao.remove(createdRecord.id);
        }
        if (updatedBook) {
          // Rollback book update
          bookDao.update(originalBook);
        }
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
        return ResponseHandlingService.handleBusinessError(
          res,
          "rollbackFailed",
          "Create operation failed and rollback was unsuccessful. Data may be in an inconsistent state."
        );
      }
      return ResponseHandlingService.handleBusinessError(
        res,
        "createOperationFailed",
        "Create operation failed but was successfully rolled back."
      );
    }
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = createAbl;
