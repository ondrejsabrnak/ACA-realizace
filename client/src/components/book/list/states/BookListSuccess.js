import React from "react";
import { BookList, BookEmptyList } from "../../../book";

const BookListSuccess = ({ books }) => {
  if (!books.length) {
    return <BookEmptyList />;
  }

  return <BookList books={books} />;
};

export default BookListSuccess;
