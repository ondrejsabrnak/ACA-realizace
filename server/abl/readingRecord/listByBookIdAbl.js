/**
 * Application Business Layer for listing reading records by book
 * Handles validation and retrieval of reading records for a specific book
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

/**
 * Validation schema for book ID parameter
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    bookId: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "ID of the book to get records for",
    },
  },
  required: ["bookId"],
  additionalProperties: false,
};

/**
 * Retrieves all reading records for a specific book
 * Records are sorted by date in descending order (newest first)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listByBookIdAbl(req, res) {
  try {
    // Input Processing - support both query and body parameters
    const reqParams = req.query?.bookId ? req.query : req.body;

    // Input Validation
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      return ResponseHandlingService.handleValidationError(res, validation.errors);
    }

    // Verify book exists
    const book = bookDao.get(reqParams.bookId);
    if (!book) {
      return ResponseHandlingService.handleNotFound(res, "Book", reqParams.bookId);
    }

    // Get records for the book
    const records = readingRecordDao.listByBookId(reqParams.bookId);

    // Sort records by date (newest first)
    records.sort((a, b) => {
      const dateA = a.date.split("/").reverse().join("-");
      const dateB = b.date.split("/").reverse().join("-");
      return new Date(dateB) - new Date(dateA);
    });

    // Response
    return ResponseHandlingService.handleSuccess(res, {
      bookId: reqParams.bookId,
      bookTitle: book.title,
      items: records,
      total: records.length
    });
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = listByBookIdAbl;
