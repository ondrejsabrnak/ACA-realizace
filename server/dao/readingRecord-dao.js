import fs from "fs";
import { join } from "path";
import crypto from "crypto";

const categoryFolderPath = join(__dirname, "storage", "bookList");

// Method to create a book in a file
const create = (book) => {
  // TODO: Implement this method
};

// Method to get a book from a file
const get = (bookId) => {
  // TODO: Implement this method
};

// Method to update a book in a file
const update = (book) => {
  // TODO: Implement this method
};
// Method to remove a book from a file
const remove = (bookId) => {
  // TODO: Implement this method
};

// Method to list all books from a file
const list = () => {
  // TODO: Implement this method
};

export default { create, get, update, remove, list };