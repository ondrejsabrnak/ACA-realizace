import React from "react";
import Alert from "react-bootstrap/Alert";
import { useTranslation } from "react-i18next";

const BookDetailError = ({ error }) => {
  const { t } = useTranslation();

  return (
    <Alert variant="danger">
      <Alert.Heading>{t("errors.error")}</Alert.Heading>
      <p>{t(`errors.${error.code}`)}</p>
    </Alert>
  );
};

export default BookDetailError;
