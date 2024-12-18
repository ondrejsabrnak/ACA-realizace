/**
 * Application Business Layer for retrieving books
 * Handles validation and retrieval of book information
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

/**
 * Validation schema for book retrieval
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "Unique identifier of the book to retrieve",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

/**
 * Retrieves a book by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getAbl(req, res) {
  try {
    // 1. Input Processing
    const reqParams = req.query?.id ? req.query : req.body;

    // 2. Input Validation
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      return ResponseHandlingService.handleValidationError(
        res,
        validation.errors
      );
    }

    // 3. Storage Operations
    const book = bookDao.get(reqParams.id);
    if (!book) {
      return ResponseHandlingService.handleNotFound(res, "Book", reqParams.id);
    }

    // 4. Response
    return ResponseHandlingService.handleSuccess(
      res,
      book,
      "Book retrieved successfully"
    );
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = getAbl;
