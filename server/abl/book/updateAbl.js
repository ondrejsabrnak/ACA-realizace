const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    title: { type: "string", minLength: 1, maxLength: 100 },
    author: { type: "string", minLength: 1, maxLength: 100 },
    numberOfPages: { type: "number", minimum: 1, maximum: 10000 },
    isbn: {
      type: "string",
      pattern: "^(?:\\d[-]?){9}[\\d|X]$|^(?:\\d[-]?){13}$",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

async function updateAbl(req, res) {
  try {
    let book = req.body;

    // Validate input
    const validation = validationService.validate(schema, book);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    // Check if a book with the same ISBN already exists
    if (book.isbn) {
      const existingBook = bookDao.getByIsbn(book.isbn);
      if (existingBook && existingBook.id !== book.id) {
        return ErrorHandlingService.handleBusinessError(
          res,
          'isbnAlreadyExists',
          'A book with the same ISBN already exists'
        );
      }
    }

    // Update book in persistent storage
    let updatedBook = bookDao.update(book);
    if (!updatedBook) {
      return ErrorHandlingService.handleNotFound(res, 'Book', book.id);
    }

    // return properly filled dtoOut
    res.json(updatedBook);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = updateAbl;
