/**
 * Application Business Layer for deleting reading records
 * Handles validation, business logic, and storage operations for reading record deletion
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

/**
 * Validation schema for reading record deletion
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "Unique identifier of the reading record to delete",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

/**
 * Deletes a reading record and updates associated book's read pages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteAbl(req, res) {
  try {
    // 1. Input Processing
    const reqParams = req.body;

    // 2. Input Validation
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      return ResponseHandlingService.handleValidationError(
        res,
        validation.errors
      );
    }

    // 3. Entity Existence Checks
    const readingRecord = readingRecordDao.get(reqParams.id);
    if (!readingRecord) {
      return ResponseHandlingService.handleNotFound(
        res,
        "ReadingRecord",
        reqParams.id
      );
    }

    const book = bookDao.get(readingRecord.bookId);
    if (!book) {
      return ResponseHandlingService.handleNotFound(
        res,
        "Book",
        readingRecord.bookId
      );
    }

    // 4. Business Logic - Update Book Pages
    const newPagesRead = book.pagesRead - readingRecord.readPages;
    bookDao.update({
      ...book,
      pagesRead: newPagesRead,
      finished: newPagesRead >= book.numberOfPages,
    });

    // 5. Storage Operations
    readingRecordDao.remove(reqParams.id);

    // 6. Response
    return ResponseHandlingService.handleSuccess(res, {
      message: "Reading record deleted successfully",
    });
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = deleteAbl;
