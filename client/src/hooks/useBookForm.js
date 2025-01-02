import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../providers/ToastProvider";
import { BookListContext } from "../providers/BookListProvider";
import { validateIsbn } from "../utils/isbnValidation";

export const useBookForm = ({ onSubmit, onClose }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { handlerMap } = useContext(BookListContext);
  const [validated, setValidated] = useState(false);
  const [isbnError, setIsbnError] = useState("");

  const handleSubmit = async () => {
    const form = document.getElementById("addBookForm");
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);

    if (values.isbn && !validateIsbn(values.isbn)) {
      setIsbnError(t("books.isbn_invalid"));
      setValidated(true);
      return;
    }

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
    onClose();
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

  return {
    validated,
    isbnError,
    handleSubmit,
    handleClose,
    handleIsbnChange,
  };
};
