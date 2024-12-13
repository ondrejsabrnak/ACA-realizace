import React from "react";
import Row from "react-bootstrap/Row";
import BookCard from "./BookCard";
import { useTranslation } from "react-i18next";

const BookList = ({ type, books }) => {
  const { t } = useTranslation();

  if (books.length === 0) return null;

  const title =
    type === "finished" ? t("books.finished") : t("books.unfinished");

  return (
    <>
      <h2 className="h5 mb-4">{title}</h2>
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </Row>
    </>
  );
};

export default BookList;
