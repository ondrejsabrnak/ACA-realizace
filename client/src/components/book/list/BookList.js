import React from "react";
import Row from "react-bootstrap/Row";
import { BookCard, EmptyBookList } from "..";
import { useTranslation } from "react-i18next";

const BookList = ({ type, books, onToggleFinished }) => {
  const { t } = useTranslation();

  if (books.length === 0) {
    return type === "unfinished" ? <EmptyBookList /> : null;
  }

  const title =
    type === "finished" ? t("books.finished") : t("books.unfinished");

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        <h2 className="h5 mb-0">{title}</h2>
      </div>
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onToggleFinished={onToggleFinished}
          />
        ))}
      </Row>
    </>
  );
};

export default BookList;
