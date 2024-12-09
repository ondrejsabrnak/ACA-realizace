const readingRecordDao = require("../../dao/readingRecord-dao");

async function listAbl(req, res) {
  try {
    const readingRecordList = readingRecordDao.list();
    res.json(readingRecordList);
  } catch (e) {
    res.status(500).json({ readingRecord: e.readingRecord });
  }
}

module.exports = listAbl;
