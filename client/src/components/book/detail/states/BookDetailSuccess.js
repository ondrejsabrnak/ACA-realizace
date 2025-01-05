import React from "react";
import { BookDetailHeader } from "../../../book";
import BookDetailContent from "../BookDetailContent";

const BookDetailSuccess = ({ book }) => {
  return (
    <>
      <BookDetailHeader title={book.title} />
      <BookDetailContent book={book} />
    </>
  );
};

export default BookDetailSuccess;
