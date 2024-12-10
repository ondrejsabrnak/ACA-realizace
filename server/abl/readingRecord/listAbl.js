const ErrorHandlingService = require("../../services/ErrorHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");

async function listAbl(req, res) {
  try {
    const readingRecordList = readingRecordDao.list();
    res.json(readingRecordList);
  } catch (error) {
    return ErrorHandlingService.handleServerError(res, error);
  }
}

module.exports = listAbl;
