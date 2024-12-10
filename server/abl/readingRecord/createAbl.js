/**
 * Application Business Layer for creating reading records
 * Handles validation, business logic, and storage operations for new reading records
 */

const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

/**
 * Validation schema for creating reading records
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    bookId: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "ID of the book being read",
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
  required: ["bookId", "readPages", "readingTime", "date"],
  additionalProperties: false,
};

/**
 * Creates a new reading record and updates associated book's read pages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createAbl(req, res) {
  try {
    // 1. Input Processing
    let readingRecord = req.body;

    // 2. Input Validation
    const validation = validationService.validate(schema, readingRecord);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    // 3. Entity Existence Checks
    const book = bookDao.get(readingRecord.bookId);
    if (!book) {
      return ErrorHandlingService.handleNotFound(
        res,
        "Book",
        readingRecord.bookId
      );
    }

    // 4. Business Logic - Page Count Validation
    if (readingRecord.readPages > book.numberOfPages - book.pagesRead) {
      return ErrorHandlingService.handleBusinessError(
        res,
        "readPagesExceedsLeftPages",
        "Read pages exceed the number of left pages in the book"
      );
    }

    // 5. Storage Operations
    readingRecord = readingRecordDao.create(readingRecord);
    bookDao.update({
      ...book,
      pagesRead: book.pagesRead + readingRecord.readPages,
      finished: book.pagesRead + readingRecord.readPages >= book.numberOfPages,
    });

    // 6. Response
    res.json(readingRecord);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = createAbl;
