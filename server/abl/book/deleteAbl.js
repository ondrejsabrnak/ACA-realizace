const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
const bookDao = require("../../dao/book-dao");
const readingRecordDao = require("../../dao/readingRecord-dao");

const validationService = new ValidationService();

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function deleteAbl(req, res) {
  try {
    const reqParams = req.body;

    // Validate input
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    // Check if book exists before attempting to delete
    const book = bookDao.get(reqParams.id);
    if (!book) {
      return ErrorHandlingService.handleNotFound(res, 'Book', reqParams.id);
    }

    // Remove reading records associated with the book
    readingRecordDao.removeByBookId(reqParams.id);

    // Remove book from persistent storage
    bookDao.remove(reqParams.id);

    // Return success
    res.json({});
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = deleteAbl;
