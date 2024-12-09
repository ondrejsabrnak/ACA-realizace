const ValidationService = require("../../services/ValidationService");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function getAbl(req, res) {
  try {
    // Get request parameters
    const reqParams = req.query?.id ? req.query : req.body;

    // Validate request parameters
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      res.status(400).json(validation.errors);
      return;
    }

    // Get the book from persistent storage
    const book = bookDao.get(reqParams.id);
    if (!book) {
      res.status(404).json({
        code: "bookNotFound",
        book: `Book with id ${reqParams.id} not found.`,
      });
      return;
    }

    // Return the book
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = getAbl;
