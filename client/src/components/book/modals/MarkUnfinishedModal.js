import React from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../common/ConfirmModal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

const MarkUnfinishedModal = ({ show, onHide, onConfirm, book }) => {
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const result = await onConfirm({
      id: book.id,
      finished: false,
      rating: 0,
      review: "",
    });

    if (result?.ok) {
      onHide();
    }
  };

  return (
    <ConfirmModal
      show={show}
      onHide={onHide}
      onConfirm={handleSubmit}
      title={t("books.confirm_status_change")}
      confirmButtonText={t("common.confirm")}
    >
      <Form id="unfinishBookForm">
        <p className="mb-4">
          {t("books.confirm_mark_unfinished", { title: book.title })}
        </p>
        <Alert variant="warning" className="mb-0">
          {t("books.warning_lose_data")}
        </Alert>
      </Form>
    </ConfirmModal>
  );
};

export default MarkUnfinishedModal;
