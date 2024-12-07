const Ajv = require("ajv");
const ajv = new Ajv();

const readingRecordDao = require("../../dao/readingRecord-dao");
const bookDao = require("../../dao/book-dao");

const schema = {
  type: "object",
  properties: {
    bookId: { type: "string", minLength: 32, maxLength: 32 },
    readPages: { type: "integer", minimum: 1 },
    readingTime: {
      type: "string",
      pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
    }, // hh:mm format
    date: { type: "string", format: "date" },
    note: { type: "string", maxLength: 500 },
  },
  required: ["bookId", "readPages", "readingTime", "date"],
  additionalProperties: false,
};

async function createAbl(req, res) {
  // TODO: Implement the createAbl function
}

module.exports = createAbl;
