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

    // Get the reading record from persistent storage
    const readingRecord = readingRecordDao.get(reqParams.id);
    if (!readingRecord) {
      res.status(404).json({
        code: "readingRecordNotFound",
        message: `Reading record ${reqParams.id} not found`,
      });
      return;
    }

    // Return the reading record
    res.json(readingRecord);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = getAbl;
