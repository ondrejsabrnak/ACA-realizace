/**
 * Application Business Layer for retrieving reading records
 * Handles validation and retrieval of reading record information
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");

const validationService = new ValidationService();

/**
 * Validation schema for reading record retrieval
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "Unique identifier of the reading record to retrieve",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

/**
 * Retrieves a reading record by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getAbl(req, res) {
  try {
    // 1. Input Processing
    const reqParams = req.query?.id ? req.query : req.body;

    // 2. Input Validation
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      return ResponseHandlingService.handleValidationError(
        res,
        validation.errors
      );
    }

    // 3. Storage Operations
    const readingRecord = readingRecordDao.get(reqParams.id);
    if (!readingRecord) {
      return ResponseHandlingService.handleNotFound(
        res,
        "ReadingRecord",
        reqParams.id
      );
    }

    // 4. Response
    return ResponseHandlingService.handleSuccess(res, readingRecord);
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = getAbl;
