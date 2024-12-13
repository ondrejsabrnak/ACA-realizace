import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

const AddBookButton = () => {
  const { t } = useTranslation();

  return (
    <Button
      variant="primary"
      size="sm"
      className="d-flex align-items-center gap-2"
    >
      <i className="bi bi-plus-lg"></i>
      <span>{t("books.add_book")}</span>
    </Button>
  );
};

export default AddBookButton;
