/**
 * Application Business Layer for listing books
 * Handles retrieval of all books in the system
 */

const ResponseHandlingService = require("../../services/ResponseHandlingService");
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
    return ResponseHandlingService.handleSuccess(
      res,
      {
        items: bookList,
        total: bookList.length,
      },
      "Books retrieved successfully"
    );
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = listAbl;
