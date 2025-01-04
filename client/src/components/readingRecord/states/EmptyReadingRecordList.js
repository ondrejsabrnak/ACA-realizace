import React from "react";
import Alert from "react-bootstrap/Alert";
import { useTranslation } from "react-i18next";

const EmptyReadingRecordList = () => {
  const { t } = useTranslation();
  return <Alert variant="info">{t("books.no_reading_records")}</Alert>;
};

export default EmptyReadingRecordList;
