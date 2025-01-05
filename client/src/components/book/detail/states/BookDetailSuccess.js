import React from "react";
import { BookDetailHeader } from "../../../book";
import BookDetailContent from "../BookDetailContent";
import { useNavigate } from "react-router-dom";

const BookDetailSuccess = ({ book }) => {
  const navigate = useNavigate();

  return (
    <>
      <BookDetailHeader title={book.title} onBack={() => navigate(-1)} />
      <BookDetailContent book={book} />
    </>
  );
};

export default BookDetailSuccess;
