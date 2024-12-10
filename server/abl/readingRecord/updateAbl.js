/**
 * Application Business Layer for updating reading records
 * Handles validation, business logic, and storage operations for reading record updates
 */

const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
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
  try {
    // 1. Input Processing
    const readingRecord = req.body;

    // 2. Input Validation
    const validation = validationService.validate(schema, readingRecord);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    // 3. Entity Existence Checks
    const existingRecord = readingRecordDao.get(readingRecord.id);
    if (!existingRecord) {
      return ErrorHandlingService.handleNotFound(
        res,
        "ReadingRecord",
        readingRecord.id
      );
    }

    const book = bookDao.get(existingRecord.bookId);
    if (!book) {
      return ErrorHandlingService.handleNotFound(
        res,
        "Book",
        existingRecord.bookId
      );
    }

    // 4. Business Logic - Page Count Validation & Update
    if (readingRecord.readPages) {
      const totalPagesWithoutThisRecord =
        book.pagesRead - existingRecord.readPages;
      const newPagesRead =
        totalPagesWithoutThisRecord + readingRecord.readPages;

      if (
        readingRecord.readPages >
        book.numberOfPages - totalPagesWithoutThisRecord
      ) {
        return ErrorHandlingService.handleBusinessError(
          res,
          "readPagesExceedsLeftPages",
          "Read pages exceed the number of left pages in the book"
        );
      }

      // Update book with new pages read and finished status
      bookDao.update({
        ...book,
        pagesRead: newPagesRead,
        finished: newPagesRead >= book.numberOfPages,
      });
    }

    // 5. Storage Operations
    const updatedRecord = readingRecordDao.update({
      ...existingRecord,
      ...readingRecord,
    });

    // 6. Response
    res.json(updatedRecord);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = updateAbl;
