/**
 * Application Business Layer for deleting reading records
 * Handles validation, business logic, and storage operations for reading record deletion
 */

const ValidationService = require("../../services/ValidationService");
const ResponseHandlingService = require("../../services/ResponseHandlingService");
const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

/**
 * Validation schema for reading record deletion
 * @const {Object} schema
 */
const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 32,
      maxLength: 32,
      description: "Unique identifier of the reading record to delete",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

/**
 * Deletes a reading record and updates associated book's read pages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteAbl(req, res) {
  let originalBook = null;
  let originalRecord = null;
  let deletedRecord = false;
  let updatedBook = null;

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

    // Get and validate reading record
    originalRecord = readingRecordDao.get(reqParams.id);
    if (!originalRecord) {
      return ResponseHandlingService.handleNotFound(
        res,
        "ReadingRecord",
        reqParams.id
      );
    }

    // Get and validate book
    originalBook = bookDao.get(originalRecord.bookId);
    if (!originalBook) {
      return ResponseHandlingService.handleNotFound(
        res,
        "Book",
        originalRecord.bookId
      );
    }

    try {
      // Start atomic operation

      // 1. Update book's pages and status
      const newPagesRead = originalBook.pagesRead - originalRecord.readPages;
      updatedBook = bookDao.update({
        ...originalBook,
        pagesRead: newPagesRead,
        finished: newPagesRead >= originalBook.numberOfPages,
      });

      // 2. Delete reading record
      readingRecordDao.remove(reqParams.id);
      deletedRecord = true;

      // If we got here, both operations succeeded
      return ResponseHandlingService.handleSuccess(res, {
        message: "Reading record deleted successfully",
      });
    } catch (error) {
      // If any operation failed, try to rollback
      try {
        if (updatedBook) {
          // Rollback book update
          bookDao.update(originalBook);
        }
        if (deletedRecord) {
          // Rollback reading record deletion by recreating it
          readingRecordDao.create({
            ...originalRecord,
            id: originalRecord.id, // Preserve original ID
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
