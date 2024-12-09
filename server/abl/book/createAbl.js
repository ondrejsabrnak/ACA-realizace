const ValidationService = require("../../services/ValidationService");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

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

    const validation = validationService.validate(schema, book);
    if (!validation.valid) {
      res.status(400).json(validation.errors);
      return;
    }

    if (bookDao.getByIsbn(book.isbn)) {
      res.status(400).json({
        code: "isbnAlreadyExists",
        message: "A book with the same ISBN already exists",
      });
      return;
    }

    book = bookDao.create(book);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = createAbl;
