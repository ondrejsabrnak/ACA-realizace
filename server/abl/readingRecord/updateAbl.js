const Ajv = require("ajv");
const ajv = new Ajv();

const readingRecordDao = require("../../dao/readingRecord-dao");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    readPages: { type: "integer", minLength: 1 },
    readingTime: {
      type: "string",
      pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
    }, // hh:mm format
    date: { type: "string", format: "date" },
    note: { type: "string", maxLength: 500 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function updateAbl(req, res) {
  // TODO: Implement the updateAbl function
}

module.exports = updateAbl;
