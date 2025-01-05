import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../providers/ToastProvider";
import { BookListContext } from "../../../providers/BookListProvider";
import ConfirmModal from "../../common/ConfirmModal";

const BookDeleteModal = ({ show, onHide, book }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast, showError } = useToast();
  const { handlerMap } = useContext(BookListContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await handlerMap.handleDelete({ id: book.id });
      if (result.ok) {
        showToast("success", null, "book_deleted");
        navigate("/", { replace: true });
      } else {
        setIsDeleting(false);
        showError(result.error.code, result.error.message);
      }
    } catch (error) {
      setIsDeleting(false);
      showError("unexpectedError", error.message);
    }
  };

  return (
    <ConfirmModal
      show={show}
      onHide={onHide}
      onConfirm={handleDelete}
      title={t("books.delete_book")}
      confirmButtonVariant="danger"
      confirmButtonText={t("common.delete")}
      isLoading={isDeleting}
    >
      {t("books.confirm_delete_message", { title: book.title })}
    </ConfirmModal>
  );
};

export default BookDeleteModal;
