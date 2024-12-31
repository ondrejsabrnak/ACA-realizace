import React from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

const BookHeader = ({ title, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <Button
        variant="link"
        className="p-0 mb-2 text-secondary"
        onClick={onBack}
      >
        <i className="bi bi-arrow-left me-2"></i>
        {t("common.back")}
      </Button>
      <h1 className="mb-0">{title}</h1>
    </div>
  );
};

export default BookHeader;
