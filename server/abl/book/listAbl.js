const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao");

async function listAbl(req, res) {
  try {
    const bookList = bookDao.list();
    res.json(bookList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = listAbl;
