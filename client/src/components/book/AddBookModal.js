import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../common/ConfirmModal";

const AddBookModal = ({ show, onHide, onSubmit }) => {
  const { t } = useTranslation();
  const [validated, setValidated] = useState(false);

  const handleSubmit = async () => {
    const form = document.getElementById("addBookForm");
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    const formData = new FormData(form);
    const values = Object.fromEntries(formData);

    const result = await onSubmit({
      title: values.title,
      author: values.author,
      numberOfPages: parseInt(values.numberOfPages, 10),
      isbn: values.isbn || undefined,
    });

    if (result?.ok) {
      handleClose();
    }
  };

  const handleClose = () => {
    setValidated(false);
    onHide();
  };

  return (
    <ConfirmModal
      show={show}
      onHide={handleClose}
      onConfirm={handleSubmit}
      title={t("books.add_book")}
      confirmButtonText={t("books.add_book")}
    >
      <Form id="addBookForm" noValidate validated={validated}>
        <Form.Group className="mb-3">
          <Form.Label>{t("books.title")}</Form.Label>
          <Form.Control
            required
            type="text"
            name="title"
            placeholder={t("books.title_placeholder")}
          />
          <Form.Control.Feedback type="invalid">
            {t("books.title_required")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("books.author")}</Form.Label>
          <Form.Control
            required
            type="text"
            name="author"
            placeholder={t("books.author_placeholder")}
          />
          <Form.Control.Feedback type="invalid">
            {t("books.author_required")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("books.number_of_pages")}</Form.Label>
          <Form.Control
            required
            type="number"
            name="numberOfPages"
            min="1"
            placeholder={t("books.pages_placeholder")}
          />
          <Form.Control.Feedback type="invalid">
            {t("books.pages_required")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>{t("books.isbn")}</Form.Label>
          <Form.Control
            type="text"
            name="isbn"
            placeholder={t("books.isbn_placeholder")}
          />
        </Form.Group>
      </Form>
    </ConfirmModal>
  );
};

export default AddBookModal;
