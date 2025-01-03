import React from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../common/ConfirmModal";
import { useBookForm } from "../../../hooks/useBookForm";

const BookAddModal = ({ show, onHide, onSubmit }) => {
  const { t } = useTranslation();
  const { validated, isbnError, handleSubmit, handleClose, handleIsbnChange } =
    useBookForm({
      onSubmit,
      onClose: onHide,
    });

  return (
    <ConfirmModal
      show={show}
      onHide={handleClose}
      onConfirm={handleSubmit}
      title={t("books.add_book")}
      confirmButtonText={t("common.add")}
    >
      <Form id="addBookForm" noValidate validated={validated}>
        <Form.Group className="mb-3">
          <Form.Label>
            {t("books.title")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            required
            type="text"
            name="title"
            placeholder={t("books.title_placeholder")}
            maxLength={100}
            minLength={1}
          />
          <Form.Control.Feedback type="invalid">
            {t("books.title_required")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            {t("books.author")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            required
            type="text"
            name="author"
            placeholder={t("books.author_placeholder")}
            maxLength={100}
            minLength={1}
          />
          <Form.Control.Feedback type="invalid">
            {t("books.author_required")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            {t("books.number_of_pages")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            required
            type="number"
            name="numberOfPages"
            placeholder={t("books.pages_placeholder")}
            min={1}
            max={10000}
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
            onChange={handleIsbnChange}
            isInvalid={!!isbnError}
          />
          <Form.Control.Feedback type="invalid">
            {isbnError || t("books.isbn_invalid")}
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
    </ConfirmModal>
  );
};

export default BookAddModal;
