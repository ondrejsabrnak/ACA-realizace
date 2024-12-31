import React from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

const BookHeader = ({ title, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <div className="d-flex flex-column gap-2">
        <Button
          variant="link"
          className="text-secondary p-0 d-flex align-items-center gap-1 text-decoration-none"
          onClick={onBack}
        >
          <i className="bi bi-arrow-left"></i>
          {t("common.back")}
        </Button>
        <h1 className="mb-0">{title}</h1>
      </div>
    </div>
  );
};

export default BookHeader;
