import React from "react";
import { BookDetailInfo, BookDetailProgress, BookDetailRecords } from "..";

const BookDetailContent = ({ book }) => {
  return (
    <>
      <BookDetailInfo book={book} />
      <BookDetailProgress book={book} />
      <BookDetailRecords bookId={book.id} totalPages={book.numberOfPages} />
    </>
  );
};

export default BookDetailContent;
