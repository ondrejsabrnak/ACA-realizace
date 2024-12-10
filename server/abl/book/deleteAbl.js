/**
 * Application Business Layer for deleting books
 * Handles validation, business logic, and cascade deletion of associated reading records
 */

const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
const bookDao = require("../../dao/book-dao");
const readingRecordDao = require("../../dao/readingRecord-dao");

const validationService = new ValidationService();

/**
 * Validation schema for book deletion
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "Unique identifier of the book to delete",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

/**
 * Deletes a book and all its associated reading records
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
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    // 3. Entity Existence Check
    const book = bookDao.get(reqParams.id);
    if (!book) {
      return ErrorHandlingService.handleNotFound(res, "Book", reqParams.id);
    }

    // 4. Storage Operations - Cascade Delete
    readingRecordDao.removeByBookId(reqParams.id);
    bookDao.remove(reqParams.id);

    // 5. Response
    res.json({});
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = deleteAbl;
