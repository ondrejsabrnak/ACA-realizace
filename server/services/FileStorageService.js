const fs = require("fs");
const path = require("path");
const ErrorCodes = require("../constants/ErrorCodes");

/**
 * Service for handling file-based data storage
 * Provides CRUD operations for storing and retrieving JSON data using the file system
 * @class FileStorageService
 */
class FileStorageService {
  /**
   * Creates a new FileStorageService instance
   * @param {string} storagePath - Path where the storage directory should be created/accessed
   * @throws {Error} If storagePath is not provided or invalid
   */
  constructor(storagePath) {
    if (!storagePath) {
      throw {
        code: ErrorCodes.INVALID_INPUT,
        message: "Storage path must be provided",
      };
    }
    this.storagePath = storagePath;
    this._ensureDirectoryExists();
  }

  /**
   * Creates a new item in storage
   * @param {string} id - Unique identifier for the item
   * @param {Object} data - Data to be stored
   * @returns {Object} The stored data
   * @throws {Object} Error with standardized code and message
   */
  create(id, data) {
    if (!id || typeof id !== "string") {
      throw {
        code: ErrorCodes.INVALID_INPUT,
        message: "Valid ID must be provided",
      };
    }
    if (!data || typeof data !== "object") {
      throw {
        code: ErrorCodes.INVALID_INPUT,
        message: "Valid data object must be provided",
      };
    }

    try {
      const filePath = this._getFilePath(id);
      if (fs.existsSync(filePath)) {
        throw {
          code: ErrorCodes.DUPLICATE_ENTRY,
          message: `Item with id '${id}' already exists`,
        };
      }

      const fileData = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, fileData, "utf8");
      return data;
    } catch (error) {
      if (error.code) throw error;
      throw {
        code: ErrorCodes.STORAGE_CREATE_FAILED,
        message: `Failed to create item: ${error.message}`,
      };
    }
  }

  /**
   * Retrieves an item from storage
   * @param {string} id - ID of the item to retrieve
   * @returns {Object|null} The retrieved data or null if not found
   * @throws {Object} Error with standardized code and message
   */
  get(id) {
    if (!id || typeof id !== "string") {
      throw {
        code: ErrorCodes.INVALID_INPUT,
        message: "Valid ID must be provided",
      };
    }

    try {
      const filePath = this._getFilePath(id);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      const fileData = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileData);
    } catch (error) {
      throw {
        code: ErrorCodes.STORAGE_READ_FAILED,
        message: `Failed to read item: ${error.message}`,
      };
    }
  }

  /**
   * Updates an existing item in storage
   * @param {string} id - ID of the item to update
   * @param {Object} data - New data to store
   * @returns {Object} The updated data
   * @throws {Object} Error with standardized code and message
   */
  update(id, data) {
    if (!id || typeof id !== "string") {
      throw {
        code: ErrorCodes.INVALID_INPUT,
        message: "Valid ID must be provided",
      };
    }
    if (!data || typeof data !== "object") {
      throw {
        code: ErrorCodes.INVALID_INPUT,
        message: "Valid data object must be provided",
      };
    }

    try {
      const filePath = this._getFilePath(id);
      if (!fs.existsSync(filePath)) {
        throw {
          code: ErrorCodes.NOT_FOUND,
          message: `Item with id '${id}' not found`,
        };
      }

      const fileData = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, fileData, "utf8");
      return data;
    } catch (error) {
      if (error.code) throw error;
      throw {
        code: ErrorCodes.STORAGE_UPDATE_FAILED,
        message: `Failed to update item: ${error.message}`,
      };
    }
  }

  /**
   * Removes an item from storage
   * @param {string} id - ID of the item to remove
   * @returns {Object} Empty object on success
   * @throws {Object} Error with standardized code and message
   */
  remove(id) {
    if (!id || typeof id !== "string") {
      throw {
        code: ErrorCodes.INVALID_INPUT,
        message: "Valid ID must be provided",
      };
    }

    try {
      const filePath = this._getFilePath(id);
      if (!fs.existsSync(filePath)) {
        throw {
          code: ErrorCodes.NOT_FOUND,
          message: `Item with id '${id}' not found`,
        };
      }
      fs.unlinkSync(filePath);
      return {};
    } catch (error) {
      if (error.code) throw error;
      throw {
        code: ErrorCodes.STORAGE_DELETE_FAILED,
        message: `Failed to remove item: ${error.message}`,
      };
    }
  }

  /**
   * Lists all items in storage
   * @returns {Array<Object>} Array of all stored items
   * @throws {Object} Error with standardized code and message
   */
  list() {
    try {
      if (!fs.existsSync(this.storagePath)) {
        return [];
      }
      return fs
        .readdirSync(this.storagePath)
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
          try {
            const fileData = fs.readFileSync(
              path.join(this.storagePath, file),
              "utf8"
            );
            return JSON.parse(fileData);
          } catch (error) {
            console.error(`Failed to read file ${file}:`, error);
            return null;
          }
        })
        .filter((item) => item !== null);
    } catch (error) {
      throw {
        code: ErrorCodes.STORAGE_LIST_FAILED,
        message: `Failed to list items: ${error.message}`,
      };
    }
  }

  /**
   * Gets the full file path for an item
   * @private
   * @param {string} id - ID of the item
   * @returns {string} Full file path
   */
  _getFilePath(id) {
    return path.join(this.storagePath, `${id}.json`);
  }

  /**
   * Ensures the storage directory exists
   * @private
   * @throws {Object} Error with standardized code and message
   */
  _ensureDirectoryExists() {
    try {
      if (!fs.existsSync(this.storagePath)) {
        fs.mkdirSync(this.storagePath, { recursive: true });
      }
    } catch (error) {
      throw {
        code: ErrorCodes.STORAGE_CREATE_FAILED,
        message: `Failed to create storage directory: ${error.message}`,
      };
    }
  }
}

module.exports = FileStorageService;
