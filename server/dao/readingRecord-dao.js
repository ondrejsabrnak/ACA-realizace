const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const readingRecordFolderPath = path.join(
  __dirname,
  "storage",
  "readingRecordList"
);

// Method to create a reading record in a file
function create(readingRecord) {
  try {
    readingRecord.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(
      readingRecordFolderPath,
      `${readingRecord.id}.json`
    );
    const fileData = JSON.stringify(readingRecord);
    fs.writeFileSync(filePath, fileData, "utf8");
    return readingRecord;
  } catch (error) {
    throw { code: "failedToCreateReadingRecord", message: error.message };
  }
}

// Method to get a reading record from a file
function get(readingRecordId) {
  try {
    const filePath = path.join(
      readingRecordFolderPath,
      `${readingRecordId}.json`
    );
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadReadingRecord", message: error.message };
  }
}

// Method to update a reading record in a file
function update(readingRecord) {
  // TODO: Implement this method
}

// Method to remove a reading record from a file
function remove(readingRecordId) {
  try {
    const filePath = path.join(
      readingRecordFolderPath,
      `${readingRecordId}.json`
    );
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveReadingRecord", message: error.message };
  }
}

// Method to remove all reading records by bookId from a file
function removeByBookId(bookId) {
  try {
    const readingRecords = listByBookId(bookId);
    readingRecords.forEach((readingRecord) => {
      remove(readingRecord.id);
    });
    return {};
  } catch (error) {
    throw {
      code: "failedToRemoveReadingRecordsByBookId",
      message: error.message,
    };
  }
}

// Method to list all reading records from a file
function list() {
  try {
    const files = fs.readdirSync(readingRecordFolderPath);
    const readingRecordList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(readingRecordFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    readingRecordList.sort((a, b) => new Date(a.date) - new Date(b.date));
    return readingRecordList;
  } catch (error) {
    throw { code: "failedToListReadingRecords", message: error.message };
  }
}

// Method to list all reading records by bookId from a file
function listByBookId(bookId) {
  const readingRecordList = list();
  return readingRecordList.filter(
    (readingRecord) => readingRecord.bookId === bookId
  );
}

module.exports = {
  create,
  get,
  update,
  remove,
  removeByBookId,
  list,
  listByBookId,
};
