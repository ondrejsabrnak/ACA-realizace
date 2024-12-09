const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const FileStorageService = require("../services/storage/FileStorageService");

const storageService = new FileStorageService(
  path.join(__dirname, "storage", "bookList")
);

// Method to create a book in a file
function create(book) {
  try {
    book.id = crypto.randomBytes(16).toString("hex");
    book.pagesRead = 0;
    book.finished = false;
    return storageService.create(book.id, book);
  } catch (error) {
    throw { code: "failedToCreateBook", book: error.message };
  }
}

// Method to get a book from a file
function get(bookId) {
  return storageService.get(bookId);
}

// Method to get a book by ISBN from a file
function getByIsbn(isbn) {
  return list().find((book) => book.isbn === isbn);
}

// Method to update a book in a file
function update(book) {
  return storageService.update(book.id, book);
}

// Method to update the pages read of a book in a file
function updatePagesRead(bookId, pagesRead) {
  return storageService.update(bookId, { pagesRead });
}

// Method to update the finished status of a book in a file
function updateFinished(bookId, finished) {
  return storageService.update(bookId, { finished });
}

// Method to remove a book from a file
function remove(bookId) {
  return storageService.remove(bookId);
}

// Method to list all books from a file
function list() {
  return storageService.list();
}

module.exports = {
  create,
  get,
  getByIsbn,
  update,
  updatePagesRead,
  updateFinished,
  remove,
  list,
};
