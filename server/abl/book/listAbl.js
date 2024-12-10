const ErrorHandlingService = require("../../services/ErrorHandlingService");
const bookDao = require("../../dao/book-dao");

async function listAbl(req, res) {
  try {
    const bookList = bookDao.list();
    res.json(bookList);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = listAbl;
