const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

const schema = {
  type: "object",
  properties: {
    bookId: { type: "string", minLength: 32, maxLength: 32 },
    readPages: { type: "integer", minimum: 1 },
    readingTime: {
      type: "string",
      pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
    }, // hh:mm format
    date: {
      type: "string",
      pattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$",
    },
    note: { type: "string", maxLength: 500 },
  },
  required: ["bookId", "readPages", "readingTime", "date"],
  additionalProperties: false,
};

async function createAbl(req, res) {
  try {
    let readingRecord = req.body;

    // Validate the input
    const validation = validationService.validate(schema, readingRecord);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    const book = bookDao.get(readingRecord.bookId);

    // Check if the book exists
    if (!book) {
      return ErrorHandlingService.handleNotFound(res, 'Book', readingRecord.bookId);
    }

    // Check if the read pages exceed the number of left pages in the book
    if (readingRecord.readPages > book.numberOfPages - book.pagesRead) {
      return ErrorHandlingService.handleBusinessError(
        res,
        'readPagesExceedsLeftPages',
        'Read pages exceed the number of left pages in the book'
      );
    }

    // Create the reading record in persistent storage
    readingRecord = readingRecordDao.create(readingRecord);

    // Update the book's pagesRead
    bookDao.updatePagesRead(book.id, book.pagesRead + readingRecord.readPages);

    // Return the reading record
    res.json(readingRecord);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = createAbl;
