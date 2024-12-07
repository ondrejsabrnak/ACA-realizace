const Ajv = require("ajv");
const ajv = new Ajv();

const readingRecordDao = require("../../dao/readingRecord-dao");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function deleteAbl(req, res) {
  // TODO: Implement the deleteAbl function
}

module.exports = deleteAbl;
