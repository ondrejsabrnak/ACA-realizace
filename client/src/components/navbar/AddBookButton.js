import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import BookAddModal from "../book/modals/BookAddModal";

const AddBookButton = ({ onAddBook }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        className="d-flex align-items-center gap-2"
        onClick={() => setShowModal(true)}
      >
        <i className="bi bi-plus-lg"></i>
        <span>{t("books.add_book")}</span>
      </Button>

      <BookAddModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={onAddBook}
      />
    </>
  );
};

export default AddBookButton;
