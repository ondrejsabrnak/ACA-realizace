/**
 * Data Access Object for Books
 * Handles CRUD operations and data persistence for books using file storage
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const FileStorageService = require("../services/FileStorageService");

const storageService = new FileStorageService(
  path.join(__dirname, "storage", "bookList")
);

/**
 * Creates a new book with default reading progress values
 * @param {Object} book - Book data without ID
 * @returns {Object} Created book with generated ID and initial progress
 */
function create(book) {
  book.id = crypto.randomBytes(16).toString("hex");
  book.pagesRead = 0;
  book.finished = false;
  return storageService.create(book.id, book);
}

/**
 * Retrieves a book by ID
 * @param {string} bookId - ID of the book to retrieve
 * @returns {Object|null} Book if found, null otherwise
 */
function get(bookId) {
  return storageService.get(bookId);
}

/**
 * Updates an existing book
 * @param {Object} book - Book data with ID
 * @returns {Object} Updated book
 */
function update(book) {
  return storageService.update(book.id, book);
}

/**
 * Removes a book by ID
 * @param {string} bookId - ID of the book to remove
 * @returns {Object} Empty object on success
 */
function remove(bookId) {
  return storageService.remove(bookId);
}

/**
 * Lists all books
 * @returns {Array<Object>} Array of all books
 */
function list() {
  return storageService.list();
}

/**
 * Retrieves a book by ISBN
 * @param {string} isbn - ISBN-10 or ISBN-13 of the book
 * @returns {Object|undefined} Book if found, undefined otherwise
 */
function getByIsbn(isbn) {
  return list().find((book) => book.isbn === isbn);
}

module.exports = {
  create,
  get,
  getByIsbn,
  update,
  remove,
  list,
};
