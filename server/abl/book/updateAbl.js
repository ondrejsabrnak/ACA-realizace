/**
 * Application Business Layer for updating books
 * Handles validation, business logic, and storage operations for book updates
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

/**
 * Validation schema for book updates
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "Unique identifier of the book",
    },
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
      description: "ISBN-10 or ISBN-13 of the book",
    },
    pagesRead: {
      type: "number",
      minimum: 0,
      description: "Number of pages already read",
    },
    finished: {
      type: "boolean",
      description: "Whether the book has been finished",
    }
  },
  required: ["id"],
  additionalProperties: false,
};

/**
 * Updates an existing book's information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateAbl(req, res) {
  try {
    // 1. Input Processing
    const bookUpdate = req.body;

    // 2. Input Validation
    const validation = validationService.validate(schema, bookUpdate);
    if (!validation.valid) {
      return ResponseHandlingService.handleValidationError(res, validation.errors);
    }

    // 3. Get existing book
    const existingBook = bookDao.get(bookUpdate.id);
    if (!existingBook) {
      return ResponseHandlingService.handleNotFound(res, "Book", bookUpdate.id);
    }

    // 4. Business Logic - ISBN Uniqueness Check
    if (bookUpdate.isbn) {
      const bookWithIsbn = bookDao.getByIsbn(bookUpdate.isbn);
      if (bookWithIsbn && bookWithIsbn.id !== bookUpdate.id) {
        return ResponseHandlingService.handleBusinessError(
          res,
          "isbnAlreadyExists",
          "A book with the same ISBN already exists"
        );
      }
    }

    // 5. Business Logic - Pages Read Validation
    if (bookUpdate.pagesRead !== undefined) {
      if (bookUpdate.pagesRead > (bookUpdate.numberOfPages || existingBook.numberOfPages)) {
        return ResponseHandlingService.handleBusinessError(
          res,
          "pagesReadExceedsTotal",
          "Pages read cannot exceed total number of pages"
        );
      }
    }

    // 6. Storage Operations - Merge existing book with updates
    const updatedBook = bookDao.update({
      ...existingBook,
      ...bookUpdate
    });

    // 7. Response
    return ResponseHandlingService.handleSuccess(res, updatedBook);
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = updateAbl;
