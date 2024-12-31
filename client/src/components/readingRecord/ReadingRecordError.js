import React from "react";
import { useTranslation } from "react-i18next";
import Alert from "react-bootstrap/Alert";

const ReadingRecordError = ({ error }) => {
  const { t } = useTranslation();

  return (
    <Alert variant="danger">
      {t(`errors.${error.code}`, { defaultValue: error.message })}
    </Alert>
  );
};

export default ReadingRecordError;
