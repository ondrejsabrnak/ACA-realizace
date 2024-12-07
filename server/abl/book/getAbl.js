const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao");

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
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        book: "dtoIn is not valid",
        validationError: ajv.errors,
      });
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
  } catch (e) {
    res.status(500).json({ book: e.book });
  }
}

module.exports = getAbl;
