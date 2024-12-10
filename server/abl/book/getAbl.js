const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function getAbl(req, res) {
  try {
    // Get request parameters
    const reqParams = req.query?.id ? req.query : req.body;

    // Validate request parameters
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    // Get the book from persistent storage
    const book = bookDao.get(reqParams.id);
    if (!book) {
      return ErrorHandlingService.handleNotFound(res, 'Book', reqParams.id);
    }

    // Return the book
    res.json(book);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = getAbl;
