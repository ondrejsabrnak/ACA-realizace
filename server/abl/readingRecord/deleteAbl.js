const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");
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

async function deleteAbl(req, res) {
  try {
    // Get request parameters
    const reqParams = req.body;

    // Validate input
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    // Get the reading record from persistent storage
    const readingRecord = readingRecordDao.get(reqParams.id);

    // Check that the reading record exists
    if (!readingRecord) {
      return ErrorHandlingService.handleNotFound(res, 'ReadingRecord', reqParams.id);
    }

    // Get the book from persistent storage
    const book = bookDao.get(readingRecord.bookId);

    // Check that the book exists
    if (!book) {
      return ErrorHandlingService.handleNotFound(res, 'Book', readingRecord.bookId);
    }

    // Update read pages in book to reflect the deletion
    bookDao.updatePagesRead(
      readingRecord.bookId,
      book.pagesRead - readingRecord.readPages
    );

    // Remove readingRecord from persistent storage
    readingRecordDao.remove(reqParams.id);

    // Return success
    res.json({});
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = deleteAbl;
