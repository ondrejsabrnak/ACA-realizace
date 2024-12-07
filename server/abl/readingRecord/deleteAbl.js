const Ajv = require("ajv");
const ajv = new Ajv();

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
    // Get request parameters
    const reqParams = req.body;

    // Validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Remove readingRecord from persistent storage
    readingRecordDao.remove(reqParams.id);

    // Return success
    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = deleteAbl;
