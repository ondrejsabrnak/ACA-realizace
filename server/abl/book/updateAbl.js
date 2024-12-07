const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao");

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
    const valid = ajv.validate(schema, book);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        book: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Check if a book with the same ISBN already exists
    if (bookDao.getByIsbn(book.isbn)) {
      res.status(400).json({
        code: "isbnAlreadyExists",
        message: "A book with the same ISBN already exists",
      });
      return;
    }

    // Update book in persistent storage
    let updatedbook;
    try {
      updatedbook = bookDao.update(book);
    } catch (e) {
      res.status(400).json({
        ...e,
      });
      return;
    }
    if (!updatedbook) {
      res.status(404).json({
        code: "bookNotFound",
        book: `Book with id ${book.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(updatedbook);
  } catch (e) {
    res.status(500).json({ book: e.book });
  }
}

module.exports = updateAbl;
