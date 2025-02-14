import React from "react";
import Card from "react-bootstrap/Card";
import { useTranslation } from "react-i18next";
import { BookProgressBar, BookStatusToggle } from "..";
import "../css/detail/BookDetailProgress.css";

const BookDetailProgress = ({ book }) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">
            {t("books.reading_progress")}
          </Card.Title>
          <BookStatusToggle book={book} size="sm" />
        </div>
        <dl className="row mb-0">
          <dt className="col-sm-3">{t("books.state")}</dt>
          <dd className="col-sm-9">
            <span
              className={`badge ${book.finished ? "bg-success" : "bg-primary"}`}
            >
              {book.finished
                ? t("books.state_finished")
                : t("books.state_currently_reading")}
            </span>
          </dd>

          <dt className="col-sm-3">{t("books.pages_read_label")}</dt>
          <dd className="col-sm-9">
            <span className="fw-bold">{book.pagesRead}</span>
            <span className="text-muted mx-1">/</span>
            <span>{book.numberOfPages}</span>
          </dd>

          <dt className="col-sm-3">{t("books.progress")}</dt>
          <dd className="col-sm-9">
            <BookProgressBar
              pagesRead={book.pagesRead}
              numberOfPages={book.numberOfPages}
            />
          </dd>
        </dl>
      </Card.Body>
    </Card>
  );
};

export default BookDetailProgress;
