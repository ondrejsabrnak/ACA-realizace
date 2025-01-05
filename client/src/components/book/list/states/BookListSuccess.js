import React, { useState } from "react";
import { BookList, BookListSearch } from "../../../book";

const BookListSuccess = ({ books }) => {
  const [filter, setFilter] = useState("");

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <BookListSearch onSearch={setFilter} />
      <BookList books={filteredBooks} />
    </>
  );
};

export default BookListSuccess;
