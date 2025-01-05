import React from "react";
import Row from "react-bootstrap/Row";
import { BookListCard, BookEmptyList } from "..";
import { useTranslation } from "react-i18next";

const BookList = ({ books, onToggleFinished }) => {
  const { t } = useTranslation();

  const currentlyReading = books.filter((book) => !book.finished);
  const finished = books.filter((book) => book.finished);

  const renderSection = (books, type) => {
    if (books.length === 0) {
      return type === "unfinished" ? <BookEmptyList /> : null;
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
            <BookListCard
              key={book.id}
              book={book}
              onToggleFinished={onToggleFinished}
            />
          ))}
        </Row>
      </>
    );
  };

  return (
    <>
      {renderSection(currentlyReading, "unfinished")}
      {renderSection(finished, "finished")}
    </>
  );
};

export default BookList;
