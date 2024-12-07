const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao");
const readingRecordDao = require("../../dao/readingRecord-dao");

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
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        category: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Remove reading records associated with the book
    readingRecordDao.removeByBookId(reqParams.id);

    // Remove book from persistent storage
    bookDao.remove(reqParams.id);

    // Return success
    res.json({});
  } catch (e) {
    res.status(500).json({ category: e.category });
  }
}

module.exports = deleteAbl;
