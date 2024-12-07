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
  // TODO: Implement this method
}

// Method to get a reading record from a file
function get(readingRecordId) {
  // TODO: Implement this method
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

// Method to list all reading records from a file
function list() {
  // TODO: Implement this method
}

module.exports = { create, get, update, remove, list };
