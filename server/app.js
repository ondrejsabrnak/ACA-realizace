// Imports the express server and the controllers
import express from "express";
import bookController from "./controllers/book.js";
import readingRecordController from "./controllers/readingRecord.js";

// Initiate the express server
const app = express();
const port = 8000;

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
