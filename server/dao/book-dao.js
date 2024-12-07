const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const categoryFolderPath = path.join(__dirname, "storage", "bookList");

// Method to create a book in a file
function create(book) {
  // TODO: Implement this method
}

// Method to get a book from a file
function get(bookId) {
  // TODO: Implement this method
}

// Method to update a book in a file
function update(book) {
  // TODO: Implement this method
}

// Method to remove a book from a file
function remove(bookId) {
  // TODO: Implement this method
}

// Method to list all books from a file
function list() {
  // TODO: Implement this method
}

module.exports = { create, get, update, remove, list };
