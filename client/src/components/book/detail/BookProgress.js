import React from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import BookStatusToggle from "../shared/BookStatusToggle";
import BookProgressBar from "../shared/BookProgressBar";
import "../../../styles/components/book/BookProgress.css";

const BookProgress = ({ book, onShowFinishedModal, onShowUnfinishedModal }) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">
            {t("books.reading_progress")}
          </Card.Title>
          <BookStatusToggle
            finished={book.finished}
            onStatusChange={async () => {
              if (book.finished) {
                onShowUnfinishedModal();
              } else {
                onShowFinishedModal();
              }
              return { ok: true };
            }}
            size="sm"
          />
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

export default BookProgress;
