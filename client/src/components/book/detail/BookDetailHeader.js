import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const BookDetailHeader = ({ title }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mb-4">
      <Button
        variant="link"
        className="p-0 mb-2 text-secondary"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left me-2"></i>
        {t("common.back")}
      </Button>
      <h1 className="mb-0">{title}</h1>
    </div>
  );
};

export default BookDetailHeader;
