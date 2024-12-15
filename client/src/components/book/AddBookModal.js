import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../common/ConfirmModal";

const AddBookModal = ({ show, onHide, onSubmit }) => {
  const { t } = useTranslation();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    numberOfPages: "",
    isbn: ""
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.author || !formData.numberOfPages) {
      setValidated(true);
      return;
    }

    onSubmit({
      ...formData,
      id: crypto.randomUUID(),
      pagesRead: 0,
      finished: false,
      numberOfPages: parseInt(formData.numberOfPages, 10)
    });

    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      author: "",
      numberOfPages: "",
      isbn: ""
    });
    setValidated(false);
    onHide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ConfirmModal
      show={show}
      onHide={handleClose}
      onConfirm={handleSubmit}
      title={t("books.add_book")}
      confirmButtonText={t("books.add_book")}
    >
      <Form noValidate validated={validated}>
        <Form.Group className="mb-3">
          <Form.Label>{t("books.title")}</Form.Label>
          <Form.Control
            required
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
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
            value={formData.author}
            onChange={handleChange}
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
            value={formData.numberOfPages}
            onChange={handleChange}
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
            value={formData.isbn}
            onChange={handleChange}
            placeholder={t("books.isbn_placeholder")}
          />
        </Form.Group>
      </Form>
    </ConfirmModal>
  );
};

export default AddBookModal;