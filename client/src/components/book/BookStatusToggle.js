import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

const BookStatusToggle = ({ finished, onStatusChange, compact = false }) => {
  const { t } = useTranslation();

  if (compact) {
    return (
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
    );
  }

  return (
    <Button
      variant={finished ? "outline-success" : "outline-primary"}
      onClick={onStatusChange}
      className="d-flex align-items-center gap-2"
    >
      <i
        className={`bi ${finished ? "bi-check-circle-fill" : "bi-circle"}`}
      ></i>
      {finished ? t("books.mark_unfinished") : t("books.mark_finished")}
    </Button>
  );
};

export default BookStatusToggle;
