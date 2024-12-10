/**
 * Application Business Layer for listing books
 * Handles retrieval of all books in the system
 */

const ErrorHandlingService = require("../../services/ErrorHandlingService");
const bookDao = require("../../dao/book-dao");

/**
 * Retrieves all books from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listAbl(req, res) {
  try {
    // 1. Storage Operations
    const bookList = bookDao.list();

    // 2. Response
    res.json(bookList);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = listAbl;
