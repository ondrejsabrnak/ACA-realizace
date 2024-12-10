const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");

const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    readPages: { type: "integer", minLength: 1 },
    readingTime: {
      type: "string",
      pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
    }, // hh:mm format
    date: { type: "string", pattern: "^\\d{2}/\\d{2}/\\d{4}$" }, // dd/mm/yyyy format
    note: { type: "string", maxLength: 500 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function updateAbl(req, res) {
  try {
    const readingRecord = req.body;

    // Validate input
    const validation = validationService.validate(schema, readingRecord);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    // Get existing reading record
    const existingRecord = readingRecordDao.get(readingRecord.id);
    if (!existingRecord) {
      return ErrorHandlingService.handleNotFound(res, 'ReadingRecord', readingRecord.id);
    }

    // Get associated book
    const book = bookDao.get(existingRecord.bookId);
    if (!book) {
      return ErrorHandlingService.handleNotFound(res, 'Book', existingRecord.bookId);
    }

    // If readPages is being updated, check if it doesn't exceed book's pages
    if (readingRecord.readPages) {
      // Calculate total pages read excluding this record
      const totalPagesWithoutThisRecord = book.pagesRead - existingRecord.readPages;

      // Check if new readPages wouldn't exceed book's total pages
      if (readingRecord.readPages > book.numberOfPages - totalPagesWithoutThisRecord) {
        return ErrorHandlingService.handleBusinessError(
          res,
          'readPagesExceedsLeftPages',
          'Read pages exceed the number of left pages in the book'
        );
      }

      // Update book's total pages read
      bookDao.updatePagesRead(book.id, totalPagesWithoutThisRecord + readingRecord.readPages);
    }

    // Update reading record
    const updatedRecord = readingRecordDao.update({
      ...existingRecord,
      ...readingRecord,
    });

    res.json(updatedRecord);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = updateAbl;
