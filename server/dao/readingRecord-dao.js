/**
 * Data Access Object for Reading Records
 * Handles CRUD operations and data persistence for reading records using file storage
 */

const path = require("path");
const crypto = require("crypto");
const FileStorageService = require("../services/FileStorageService");

const storage = new FileStorageService(
  path.join(__dirname, "storage", "readingRecordList")
);

/**
 * Creates a new reading record
 * @param {Object} readingRecord - Reading record data without ID
 * @returns {Object} Created reading record with generated ID
 */
function create(readingRecord) {
  readingRecord.id = crypto.randomBytes(16).toString("hex");
  return storage.create(readingRecord.id, readingRecord);
}

/**
 * Retrieves a reading record by ID
 * @param {string} readingRecordId - ID of the reading record to retrieve
 * @returns {Object|null} Reading record if found, null otherwise
 */
function get(readingRecordId) {
  return storage.get(readingRecordId);
}

/**
 * Updates an existing reading record
 * @param {Object} readingRecord - Reading record data with ID
 * @returns {Object} Updated reading record
 */
function update(readingRecord) {
  return storage.update(readingRecord.id, readingRecord);
}

/**
 * Removes a reading record by ID
 * @param {string} readingRecordId - ID of the reading record to remove
 * @returns {Object} Empty object on success
 */
function remove(readingRecordId) {
  return storage.remove(readingRecordId);
}

/**
 * Lists all reading records
 * @returns {Array<Object>} Array of all reading records
 */
function list() {
  return storage.list();
}

/**
 * Lists all reading records for a specific book
 * @param {string} bookId - ID of the book to get records for
 * @returns {Array<Object>} Array of reading records for the book
 */
function listByBookId(bookId) {
  return list().filter(record => record.bookId === bookId);
}

/**
 * Removes all reading records for a specific book
 * @param {string} bookId - ID of the book whose records should be removed
 * @returns {Object} Empty object on success
 */
function removeByBookId(bookId) {
  const records = list();
  records
    .filter((record) => record.bookId === bookId)
    .forEach((record) => remove(record.id));
  return {};
}

module.exports = {
  create,
  get,
  update,
  remove,
  removeByBookId,
  list,
  listByBookId
};
