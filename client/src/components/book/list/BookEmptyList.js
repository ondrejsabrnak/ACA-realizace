import React from "react";
import Alert from "react-bootstrap/Alert";
import { useTranslation } from "react-i18next";
import { AddBookButton } from "../../navbar";

const BookEmptyList = () => {
  const { t } = useTranslation();

  return (
    <Alert
      variant="info"
      className="d-flex flex-column align-items-center gap-3 py-4"
    >
      <p className="mb-0">{t("books.no_books")}</p>
      <AddBookButton />
    </Alert>
  );
};

export default BookEmptyList;
