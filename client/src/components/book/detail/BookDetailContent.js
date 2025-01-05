import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../providers/ToastProvider";
import { BookListContext } from "../../../providers/BookListProvider";
import {
  BookDetailInfo,
  BookDetailProgress,
  BookDetailRecords,
  BookFinishedModal,
  BookUnfinishedModal,
} from "..";
import ConfirmModal from "../../common/ConfirmModal";

const BookDetailContent = ({ book }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast, showError } = useToast();
  const { handlerMap } = useContext(BookListContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: book.title,
    author: book.author,
    numberOfPages: book.numberOfPages,
    isbn: book.isbn || "",
    rating: book.rating || 0,
    review: book.review || "",
  });
  const [validated, setValidated] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [showUnfinishedModal, setShowUnfinishedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    try {
      const updateData = {
        id: book.id,
        ...editForm,
        numberOfPages: parseInt(editForm.numberOfPages, 10),
      };

      if (!updateData.isbn) {
        delete updateData.isbn;
      }

      const result = await handlerMap.handleUpdate(updateData);

      if (result.ok) {
        const bookResult = await handlerMap.handleGet({ id: book.id });
        if (bookResult.ok) {
          setIsEditing(false);
          setValidated(false);
          showToast("success", null, "book_updated");
        }
      } else {
        showError(result.error.code, result.error.message);
      }
    } catch (error) {
      showError("failedToUpdateBook", "Failed to update book");
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: book.title,
      author: book.author,
      numberOfPages: book.numberOfPages,
      isbn: book.isbn || "",
      rating: book.rating || 0,
      review: book.review || "",
    });
    setIsEditing(false);
    setValidated(false);
  };

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

  const handleStatusChange = async (updatedBook) => {
    try {
      const result = await handlerMap.handleUpdate({
        id: book.id,
        ...updatedBook,
      });

      if (result.ok) {
        const bookResult = await handlerMap.handleGet({ id: book.id });
        if (bookResult.ok) {
          return result;
        }
      } else {
        showError(result.error.code, result.error.message);
        return result;
      }
    } catch (error) {
      showError("failedToUpdateBook", "Failed to update book");
      return { ok: false, error };
    }
  };

  const handleMarkFinished = async (formData) => {
    const result = await handleStatusChange(formData);
    if (result?.ok) {
      showToast("success", null, "book_marked_finished");
      setShowFinishedModal(false);
    }
  };

  const handleMarkUnfinished = async () => {
    const result = await handleStatusChange({
      ...book,
      finished: false,
      rating: undefined,
      review: undefined,
    });
    if (result?.ok) {
      showToast("success", null, "book_marked_unfinished");
      setShowUnfinishedModal(false);
    }
  };

  const handleRecordChange = async () => {
    const result = await handlerMap.handleGet({ id: book.id });
    if (result.ok) {
      // Kniha se aktualizuje v nadřazené komponentě přes useEffect
    }
  };

  return (
    <>
      <BookDetailInfo
        book={book}
        isEditing={isEditing}
        editForm={editForm}
        onEditToggle={() => setIsEditing(!isEditing)}
        onEditFormChange={(e) =>
          setEditForm({ ...editForm, [e.target.name]: e.target.value })
        }
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        validated={validated}
        onDelete={() => setShowDeleteModal(true)}
      />

      <BookDetailProgress
        book={book}
        onShowFinishedModal={() => setShowFinishedModal(true)}
        onShowUnfinishedModal={() => setShowUnfinishedModal(true)}
      />

      <BookDetailRecords
        bookId={book.id}
        totalPages={book.numberOfPages}
        onRecordChange={handleRecordChange}
      />

      <BookFinishedModal
        show={showFinishedModal}
        onHide={() => setShowFinishedModal(false)}
        onConfirm={handleMarkFinished}
        book={book}
      />

      <BookUnfinishedModal
        show={showUnfinishedModal}
        onHide={() => setShowUnfinishedModal(false)}
        onConfirm={handleMarkUnfinished}
        book={book}
      />

      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t("books.delete_book")}
        confirmButtonVariant="danger"
        confirmButtonText={t("common.delete")}
        isLoading={isDeleting}
      >
        {t("books.confirm_delete_message", { title: book.title })}
      </ConfirmModal>
    </>
  );
};

export default BookDetailContent;
