import React, { useState } from "react";
import { BookList } from "../../../book";
import { BookListSearch } from "../../../book";

const BookListSuccess = ({ books }) => {
  const [filter, setFilter] = useState("");

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase())
  );

  const currentlyReading = filteredBooks.filter((book) => !book.finished);
  const finished = filteredBooks.filter((book) => book.finished);

  return (
    <>
      <BookListSearch onSearch={setFilter} />
      <BookList books={currentlyReading} type="unfinished" />
      <BookList books={finished} type="finished" />
    </>
  );
};

export default BookListSuccess;
