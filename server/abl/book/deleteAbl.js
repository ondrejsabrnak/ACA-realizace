const Ajv = require("ajv");
const ajv = new Ajv();
const ValidationService = require("../../services/ValidationService");
const bookDao = require("../../dao/book-dao");
const readingRecordDao = require("../../dao/readingRecord-dao");

const validationService = new ValidationService();

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function deleteAbl(req, res) {
  try {
    const reqParams = req.body;

    // Validate input
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      res.status(400).json(validation.errors);
      return;
    }

    // Remove reading records associated with the book
    readingRecordDao.removeByBookId(reqParams.id);

    // Remove book from persistent storage
    bookDao.remove(reqParams.id);

    // Return success
    res.json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = deleteAbl;
