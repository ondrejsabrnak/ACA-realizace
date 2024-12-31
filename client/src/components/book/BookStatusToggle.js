import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

const BookStatusToggle = ({ finished, onStatusChange, showLabel = true }) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex align-items-center gap-2">
      <Button
        variant="link"
        className={`p-0 ${finished ? "text-success" : "text-muted"}`}
        onClick={onStatusChange}
        title={finished ? t("books.mark_unfinished") : t("books.mark_finished")}
      >
        <i
          className={`bi ${
            finished ? "bi-check-circle-fill" : "bi-circle"
          } fs-5`}
        ></i>
      </Button>
      {showLabel && (
        <span
          className={`fw-bold ${finished ? "text-success" : "text-primary"}`}
        >
          {finished ? t("books.finished") : t("books.unfinished")}
        </span>
      )}
    </div>
  );
};

export default BookStatusToggle;
