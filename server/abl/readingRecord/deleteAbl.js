const Ajv = require("ajv");
const ajv = new Ajv();
const ValidationService = require("../../services/ValidationService");
const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const validationService = new ValidationService();

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function deleteAbl(req, res) {
  try {
    // Get request parameters
    const reqParams = req.body;

    // Validate input
    const validation = validationService.validate(schema, reqParams);
    if (!validation.valid) {
      res.status(400).json(validation.errors);
      return;
    }

    // Get the reading record from persistent storage
    const readingRecord = readingRecordDao.get(reqParams.id);

    // Check that the reading record exists
    if (!readingRecord) {
      res.status(404).json({
        code: "readingRecordNotFound",
        message: `Reading record ${reqParams.id} not found`,
      });
      return;
    }

    // Get the book from persistent storage
    const book = bookDao.get(readingRecord.bookId);

    // Check that the book exists
    if (!book) {
      res.status(400).json({
        code: "bookDoesNotExist",
        message: `Book with id ${readingRecord.bookId} does not exist`,
      });
      return;
    }

    // Update read pages in book to reflect the deletion
    bookDao.updatePagesRead(
      readingRecord.bookId,
      book.pagesRead - readingRecord.readPages
    );

    // Remove readingRecord from persistent storage
    readingRecordDao.remove(reqParams.id);

    // Return success
    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = deleteAbl;
