import React from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

const BookHeader = ({ title, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-start">
        <h1 className="mb-0">{title}</h1>
        <Button variant="outline-primary" onClick={onBack}>
          {t("common.back")}
        </Button>
      </div>
    </div>
  );
};

export default BookHeader;
