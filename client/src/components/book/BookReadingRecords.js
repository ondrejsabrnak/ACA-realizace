import React from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";

const BookReadingRecords = ({ records = [] }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <Card.Body>
        <Card.Title>{t("books.reading_records")}</Card.Title>
        {/* TODO: Add reading records list */}
      </Card.Body>
    </Card>
  );
};

export default BookReadingRecords;
