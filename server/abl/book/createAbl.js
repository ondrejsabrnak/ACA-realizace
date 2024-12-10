const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

const schema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 100 },
    author: { type: "string", minLength: 1, maxLength: 100 },
    numberOfPages: { type: "number", minimum: 1, maximum: 10000 },
    isbn: {
      type: "string",
      pattern: "^(?:\\d[-]?){9}[\\d|X]$|^(?:\\d[-]?){13}$",
    },
  },
  required: ["title", "author", "numberOfPages"],
  additionalProperties: false,
};

async function createAbl(req, res) {
  try {
    let book = req.body;

    const validation = validationService.validate(schema, book);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    if (bookDao.getByIsbn(book.isbn)) {
      return ErrorHandlingService.handleBusinessError(
        res,
        'isbnAlreadyExists',
        'A book with the same ISBN already exists'
      );
    }

    book = bookDao.create(book);
    res.json(book);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = createAbl;
