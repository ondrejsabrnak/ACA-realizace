/**
 * Application Business Layer for listing reading records
 * Handles retrieval of all reading records in the system
 */

const ErrorHandlingService = require("../../services/ErrorHandlingService");
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
    res.json(readingRecordList);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = listAbl;
