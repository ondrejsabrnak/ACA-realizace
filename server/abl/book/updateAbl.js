const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    title: { type: "string", minLength: 1, maxLength: 100 },
    author: { type: "string", minLength: 1, maxLength: 100 },
    numberOfPages: { type: "number", minimum: 1, maximum: 10000 },
    isbn: {
      type: "string",
      pattern: "^(?:\\d[-]?){9}[\\d|X]$|^(?:\\d[-]?){13}$",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

async function updateAbl(req, res) {
  // TODO: Implement the updateAbl function
}

module.exports = updateAbl;
