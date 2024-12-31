import React from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import BookStatusToggle from "./BookStatusToggle";
import "../../styles/components/book/BookProgress.css";

const BookProgress = ({ book, onShowFinishedModal, onShowUnfinishedModal }) => {
  const { t } = useTranslation();
  const progress = book.numberOfPages
    ? Math.round((book.pagesRead / book.numberOfPages) * 100)
    : 0;

  const getProgressVariant = (progress) => {
    if (progress === 100) return "success";
    if (progress >= 75) return "info";
    if (progress >= 50) return "primary";
    if (progress >= 25) return "warning";
    return "secondary";
  };

  const renderProgressBar = () => {
    const variant = getProgressVariant(progress);
    const tooltipContent = (
      <div className="text-center">
        <div>
          {t("books.pages_read_label")}: {book.pagesRead}/{book.numberOfPages}
        </div>
        <strong>
          {progress}% {t("books.finished")}
        </strong>
      </div>
    );

    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>{tooltipContent}</Tooltip>}
      >
        <div className="progress-wrapper">
          <div className="progress progress-hover">
            <div
              className={`progress-bar bg-${variant}`}
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span className="progress-label">
                {progress}% {t("books.finished")}
              </span>
            </div>
          </div>
        </div>
      </OverlayTrigger>
    );
  };

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
                ? t("books.finished")
                : t("books.currently_reading")}
            </span>
          </dd>

          <dt className="col-sm-3">{t("books.pages_read_label")}</dt>
          <dd className="col-sm-9">
            <span className="fw-bold">{book.pagesRead}</span>
            <span className="text-muted mx-1">/</span>
            <span>{book.numberOfPages}</span>
          </dd>

          <dt className="col-sm-3">{t("books.progress")}</dt>
          <dd className="col-sm-9">{renderProgressBar()}</dd>
        </dl>
      </Card.Body>
    </Card>
  );
};

export default BookProgress;
