/**
 * Application Business Layer for deleting books
 * Handles validation, business logic, and cascade deletion of associated reading records
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const bookDao = require("../../dao/book-dao");
const readingRecordDao = require("../../dao/readingRecord-dao");

const validationService = new ValidationService();

/**
 * Validation schema for book deletion
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "Unique identifier of the book to delete",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

/**
 * Deletes a book and all its associated reading records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteAbl(req, res) {
  let originalBook = null;
  let originalRecords = [];
  let deletedRecords = [];
  let bookDeleted = false;

  try {
    const reqParams = req.body;

    // Input Validation
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      return ResponseHandlingService.handleValidationError(
        res,
        validation.errors
      );
    }

    // Get and validate book
    originalBook = bookDao.get(reqParams.id);
    if (!originalBook) {
      return ResponseHandlingService.handleNotFound(res, "Book", reqParams.id);
    }

    // Get all associated reading records for potential rollback
    originalRecords = readingRecordDao
      .list()
      .filter((record) => record.bookId === reqParams.id);

    try {
      // Start atomic operation

      // 1. Delete all associated reading records
      for (const record of originalRecords) {
        readingRecordDao.remove(record.id);
        deletedRecords.push(record);
      }

      // 2. Delete the book
      bookDao.remove(reqParams.id);
      bookDeleted = true;

      // If we got here, both operations succeeded
      return ResponseHandlingService.handleSuccess(
        res,
        {
          id: reqParams.id,
        },
        "Book deleted successfully"
      );
    } catch (error) {
      // If any operation failed, try to rollback
      try {
        if (bookDeleted) {
          // Rollback book deletion
          bookDao.create({
            ...originalBook,
            id: originalBook.id, // Preserve original ID
          });
        }

        // Rollback reading records deletion
        for (const record of deletedRecords) {
          readingRecordDao.create({
            ...record,
            id: record.id, // Preserve original ID
          });
        }
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
      throw error;
    }
  } catch (error) {
    return ResponseHandlingService.handleServerError(res, error);
  }
}

module.exports = deleteAbl;
