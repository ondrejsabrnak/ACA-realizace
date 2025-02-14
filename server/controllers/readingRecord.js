const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/readingRecord/getAbl");
const ListAbl = require("../abl/readingRecord/listAbl");
const CreateAbl = require("../abl/readingRecord/createAbl");
const UpdateAbl = require("../abl/readingRecord/updateAbl");
const DeleteAbl = require("../abl/readingRecord/deleteAbl");
const ListByBookIdAbl = require("../abl/readingRecord/listByBookIdAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.get("/listByBookId", ListByBookIdAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
