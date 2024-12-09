const fs = require("fs");
const path = require("path");

/*
  This is a simple file storage service that uses the file system to store and retrieve data.
  It is used to store and retrieve data for the book and reading record daos.
*/
class FileStorageService {
  constructor(storagePath) {
    this.storagePath = storagePath;
    this._ensureDirectoryExists();
  }

  // Method to create a new item in the storage
  create(id, data) {
    try {
      const filePath = this._getFilePath(id);
      const fileData = JSON.stringify(data);
      fs.writeFileSync(filePath, fileData, "utf8");
      return data;
    } catch (error) {
      throw { code: "failedToCreate", message: error.message };
    }
  }

  // Method to get an existing item from the storage
  get(id) {
    try {
      const filePath = this._getFilePath(id);
      const fileData = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileData);
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw { code: "failedToRead", message: error.message };
    }
  }

  // Method to update an existing item in the storage
  update(id, data) {
    try {
      const currentData = this.get(id);
      if (!currentData) return null;

      const updatedData = { ...currentData, ...data };
      return this.create(id, updatedData);
    } catch (error) {
      throw { code: "failedToUpdate", message: error.message };
    }
  }

  // Method to remove an existing item from the storage
  remove(id) {
    try {
      const filePath = this._getFilePath(id);
      fs.unlinkSync(filePath);
      return {};
    } catch (error) {
      if (error.code === "ENOENT") return {};
      throw { code: "failedToDelete", message: error.message };
    }
  }

  // Method to list all items in the storage
  list() {
    try {
      const files = fs.readdirSync(this.storagePath);
      return files.map((file) => {
        const fileData = fs.readFileSync(
          path.join(this.storagePath, file),
          "utf8"
        );
        return JSON.parse(fileData);
      });
    } catch (error) {
      throw { code: "failedToList", message: error.message };
    }
  }

  // Method to get the file path for an item
  _getFilePath(id) {
    return path.join(this.storagePath, `${id}.json`);
  }

  // Method to ensure the storage directory exists
  _ensureDirectoryExists() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }
}

module.exports = FileStorageService;
