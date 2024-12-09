const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const FileStorageService = require("../services/storage/FileStorageService");

const storage = new FileStorageService(
  path.join(__dirname, "storage", "readingRecordList")
);

// Method to create a reading record in a file
function create(readingRecord) {
  try {
    readingRecord.id = crypto.randomBytes(16).toString("hex");
    return storage.create(readingRecord.id, readingRecord);
  } catch (error) {
    throw { code: "failedToCreateReadingRecord", message: error.message };
  }
}

// Method to get a reading record from a file
function get(readingRecordId) {
  return storage.get(readingRecordId);
}

// Method to update a reading record in a file
function update(readingRecord) {
  return storage.update(readingRecord.id, readingRecord);
}

// Method to remove a reading record from a file
function remove(readingRecordId) {
  return storage.remove(readingRecordId);
}

// Method to remove all reading records by bookId from a file
function removeByBookId(bookId) {
  try {
    const records = list();
    records
      .filter((record) => record.bookId === bookId)
      .forEach((record) => remove(record.id));
    return {};
  } catch (error) {
    throw { code: "failedToRemoveReadingRecords", message: error.message };
  }
}

// Method to list all reading records from a file
function list() {
  try {
    const readingRecordList = storage.list();
    readingRecordList.sort((a, b) => {
      // Convert date strings (DD/MM/YYYY) to Date objects for comparison
      const [dayA, monthA, yearA] = a.date.split("/");
      const [dayB, monthB, yearB] = b.date.split("/");
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateB - dateA; // Descending order (newest first)
    });
    return readingRecordList;
  } catch (error) {
    throw { code: "failedToListReadingRecords", message: error.message };
  }
}

// Method to list all reading records by bookId from a file
function listByBookId(bookId) {
  const records = list();
  return records.filter((record) => record.bookId === bookId);
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
