import fs from "fs";
import { join } from "path";
import crypto from "crypto";

const categoryFolderPath = join(__dirname, "storage", "readingRecordList");

// Method to create a reading record in a file
const create = (readingRecord) => {
  // TODO: Implement this method
};

// Method to get a reading record from a file
const get = (readingRecordId) => {
  // TODO: Implement this method
};

// Method to update a reading record in a file
const update = (readingRecord) => {
  // TODO: Implement this method
};
// Method to remove a reading record from a file
const remove = (readingRecordId) => {
  // TODO: Implement this method
};

// Method to list all reading records from a file
const list = () => {
  // TODO: Implement this method
};

export default { create, get, update, remove, list };
