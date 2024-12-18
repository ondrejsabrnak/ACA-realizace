/**
 * Application Business Layer for listing reading records
 * Handles retrieval of all reading records in the system
 */

const ResponseHandlingService = require("../../services/ResponseHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");

/**
 * Retrieves all reading records from the system
 * Records are sorted by date in descending order (newest first)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listAbl(req, res) {
  try {
    // 1. Storage Operations
    const readingRecordList = readingRecordDao.list();

    // 2. Response
    return ResponseHandlingService.handleSuccess(
      res,
      {
        items: readingRecordList,
        total: readingRecordList.length,
      },
      "Reading records retrieved successfully"
    );
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = listAbl;
