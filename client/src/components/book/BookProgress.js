import React from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import BookStatusToggle from "./BookStatusToggle";

const BookProgress = ({ book, onShowFinishedModal, onShowUnfinishedModal }) => {
  const { t } = useTranslation();
  const progress = book.numberOfPages
    ? Math.round((book.pagesRead / book.numberOfPages) * 100)
    : 0;

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
            {book.finished ? t("books.finished") : t("books.currently_reading")}
          </dd>

          <dt className="col-sm-3">{t("books.pages_read_label")}</dt>
          <dd className="col-sm-9">
            {book.pagesRead}/{book.numberOfPages}
          </dd>

          <dt className="col-sm-3">{t("books.progress")}</dt>
          <dd className="col-sm-9">
            <ProgressBar
              now={progress}
              label={`${progress}%`}
              style={{ height: "12px" }}
            />
          </dd>
        </dl>
      </Card.Body>
    </Card>
  );
};

export default BookProgress;
