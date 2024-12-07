// Initiate the express server
const express = require("express");
const app = express();
const port = 8000;

// Init the controllers
const bookController = require("./controllers/book");
const readingRecordController = require("./controllers/readingRecord");

app.use(express.json()); // support for application/json
app.use(express.urlencoded({ extended: true })); // support for application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("The Reader's Diary");
});

app.use("/book", bookController);
app.use("/readingRecord", readingRecordController);

app.listen(port, () => {
  console.log(`The Reader's Diary app listening on port ${port}`);
});
