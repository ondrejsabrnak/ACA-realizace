import React from "react";
import { useTranslation } from "react-i18next";
import Spinner from "react-bootstrap/Spinner";

const ReadingRecordLoading = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center p-3">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">{t("common.loading")}</span>
      </Spinner>
    </div>
  );
};

export default ReadingRecordLoading;
