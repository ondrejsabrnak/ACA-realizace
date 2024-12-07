const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const categoryFolderPath = path.join(__dirname, "storage", "readingRecordList");

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
  // TODO: Implement this method
}

// Method to list all reading records from a file
function list() {
  // TODO: Implement this method
}

module.exports = { create, get, update, remove, list };