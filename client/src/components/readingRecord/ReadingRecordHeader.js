import React from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

const ReadingRecordHeader = ({ onAddRecord }) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h2 className="h5 mb-0">{t("books.reading_records")}</h2>
      <Button variant="primary" size="sm" onClick={onAddRecord}>
        <i className="bi bi-plus-lg me-1"></i>
        {t("reading_records.add")}
      </Button>
    </div>
  );
};

export default ReadingRecordHeader;
