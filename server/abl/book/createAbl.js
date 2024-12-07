const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao");

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

    // Validate the input
    const valid = ajv.validate(schema, book);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "The input data is not valid",
        validationErrors: ajv.errors,
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

    // Store the book to persistent storage
    try {
      book = bookDao.create(book);
    } catch (e) {
      res.status(500).json(...e);
      return;
    }

    // Return the created book
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: e.message });
  }
}

module.exports = createAbl;
