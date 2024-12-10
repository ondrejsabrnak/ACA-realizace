/**
 * Application Business Layer for creating books
 * Handles validation, business logic, and storage operations for new books
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

/**
 * Validation schema for book creation
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      description: "Title of the book",
    },
    author: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      description: "Author of the book",
    },
    numberOfPages: {
      type: "number",
      minimum: 1,
      maximum: 10000,
      description: "Total number of pages in the book",
    },
    isbn: {
      type: "string",
      pattern: "^(?:\\d[-]?){9}[\\d|X]$|^(?:\\d[-]?){13}$",
      description: "ISBN-10 or ISBN-13 of the book (optional)",
    },
  },
  required: ["title", "author", "numberOfPages"],
  additionalProperties: false,
};

/**
 * Creates a new book in the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createAbl(req, res) {
  try {
    // 1. Input Processing
    let book = req.body;

    // 2. Input Validation
    const validation = validationService.validate(schema, book);
    if (!validation.valid) {
      return ResponseHandlingService.handleValidationError(
        res,
        validation.errors
      );
    }

    // 3. Business Logic - ISBN Uniqueness Check
    if (bookDao.getByIsbn(book.isbn)) {
      return ResponseHandlingService.handleBusinessError(
        res,
        "isbnAlreadyExists",
        "A book with the same ISBN already exists"
      );
    }

    // 4. Storage Operations
    book = bookDao.create(book);

    // 5. Response
    return ResponseHandlingService.handleSuccess(res, book, 201);
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = createAbl;
