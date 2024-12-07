const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const bookFolderPath = path.join(__dirname, "storage", "bookList");

// Method to create a book in a file
function create(book) {
  try {
    book.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(bookFolderPath, `${book.id}.json`);
    const fileData = JSON.stringify(book);
    fs.writeFileSync(filePath, fileData, "utf8");
    return book;
  } catch (error) {
    throw { code: "failedToCreateBook", book: error.book };
  }
}

// Method to get a book from a file
function get(bookId) {
  // TODO: Implement this method
}

function getByIsbn(isbn) {
  const bookList = list();
  return bookList.find((book) => book.isbn === isbn);
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
  try {
    const files = fs.readdirSync(bookFolderPath);
    const bookList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(bookFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return bookList;
  } catch (error) {
    throw { code: "failedToListBooks", book: error.book };
  }
}

module.exports = { create, get, getByIsbn, update, remove, list };
