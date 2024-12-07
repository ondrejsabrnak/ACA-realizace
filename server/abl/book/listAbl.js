const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao");

async function listAbl(req, res) {
  try {
    const bookList = bookDao.list();
    res.json(bookList);
  } catch (e) {
    res.status(500).json({ book: e.book });
  }
}

module.exports = listAbl;
