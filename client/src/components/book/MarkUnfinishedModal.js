import React from "react";
import Alert from "react-bootstrap/Alert";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../common/ConfirmModal";

const MarkUnfinishedModal = ({ show, onHide, onConfirm, book }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm({ rating: 0, review: "" });
  };

  return (
    <ConfirmModal
      show={show}
      onHide={onHide}
      onConfirm={handleConfirm}
      title={t("books.confirm_status_change")}
      confirmButtonText={t("books.mark_unfinished")}
    >
      <p>{t("books.confirm_mark_unfinished", { title: book.title })}</p>
      <Alert variant="warning" className="mb-0">
        {t("books.warning_lose_data")}
      </Alert>
    </ConfirmModal>
  );
};

export default MarkUnfinishedModal;