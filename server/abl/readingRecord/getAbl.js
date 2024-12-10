const ValidationService = require("../../services/ValidationService");
const ErrorHandlingService = require("../../services/ErrorHandlingService");
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

async function getAbl(req, res) {
  try {
    // Get request parameters
    const reqParams = req.query?.id ? req.query : req.body;

    // Validate request parameters
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      return ErrorHandlingService.handleValidationError(res, validation.errors);
    }

    // Get the reading record from persistent storage
    const readingRecord = readingRecordDao.get(reqParams.id);
    if (!readingRecord) {
      return ErrorHandlingService.handleNotFound(res, 'ReadingRecord', reqParams.id);
    }

    // Return the reading record
    res.json(readingRecord);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = getAbl;
