import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../common/ConfirmModal";
import { useToast } from "../../../providers/ToastProvider";
import { BookListContext } from "../../../providers/BookListProvider";
import { validateIsbn } from "../../../utils/isbnValidation";

const AddBookModal = ({ show, onHide, onSubmit }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { handlerMap } = useContext(BookListContext);
  const [validated, setValidated] = useState(false);
  const [isbnError, setIsbnError] = useState("");

  const handleSubmit = async () => {
    const form = document.getElementById("addBookForm");
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);

    // Validate ISBN format and checksum if provided
    if (values.isbn && !validateIsbn(values.isbn)) {
      setIsbnError(t("books.isbn_invalid"));
      setValidated(true);
      return;
    }

    // Check ISBN uniqueness if ISBN is provided
    if (values.isbn) {
      const isUnique = handlerMap.checkIsbnUnique(values.isbn);
      if (!isUnique) {
        setIsbnError(t("books.isbn_exists"));
        setValidated(true);
        return;
      }
    }

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    const result = await onSubmit({
      title: values.title,
      author: values.author,
      numberOfPages: parseInt(values.numberOfPages, 10),
      isbn: values.isbn || undefined,
    });

    if (result?.ok) {
      showToast("success", null, "book_created");
      handleClose();
    }
  };

  const handleClose = () => {
    setValidated(false);
    setIsbnError("");
    onHide();
  };

  const handleIsbnChange = (e) => {
    const isbn = e.target.value;
    if (isbn) {
      if (!validateIsbn(isbn)) {
        setIsbnError(t("books.isbn_invalid"));
        return;
      }
      const isUnique = handlerMap.checkIsbnUnique(isbn);
      setIsbnError(isUnique ? "" : t("books.isbn_exists"));
    } else {
      setIsbnError("");
    }
  };

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

export default AddBookModal;
