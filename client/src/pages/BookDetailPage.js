import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useToast } from "../providers/ToastProvider";
import { BookListContext } from "../providers/BookListProvider";
import FetchHelper from "../helpers/FetchHelper";
import MarkFinishedModal from "../components/book/MarkFinishedModal";
import MarkUnfinishedModal from "../components/book/MarkUnfinishedModal";
import BookHeader from "../components/book/BookHeader";
import BookInfo from "../components/book/BookInfo";
import BookReadingRecords from "../components/book/BookReadingRecords";
import ConfirmModal from "../components/common/ConfirmModal";
import { useTranslation } from "react-i18next";

const BookDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showToast } = useToast();
  const { handlerMap } = useContext(BookListContext);
  const [book, setBook] = useState(null);
  const [readingRecords, setReadingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [showUnfinishedModal, setShowUnfinishedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    numberOfPages: "",
    isbn: "",
    rating: 0,
    review: "",
  });
  const [validated, setValidated] = useState(false);

  const handleStatusChange = async (updatedBook) => {
    try {
      const result = await handlerMap.handleUpdate({
        id: book.id,
        ...updatedBook,
      });

      if (result.ok) {
        const bookResult = await handlerMap.handleGet({ id: book.id });
        if (bookResult.ok) {
          setBook(bookResult.data);
          setEditForm({
            title: bookResult.data.title,
            author: bookResult.data.author,
            numberOfPages: bookResult.data.numberOfPages,
            isbn: bookResult.data.isbn || "",
            rating: bookResult.data.rating || 0,
            review: bookResult.data.review || "",
          });
        }
        return result;
      } else {
        showError(result.error.code, result.error.message);
        return result;
      }
    } catch (error) {
      showError("failedToUpdateBook", "Failed to update book");
      return { ok: false, error };
    }
  };

  useEffect(() => {
    const loadBookDetail = async () => {
      try {
        const result = await handlerMap.handleGet({ id });
        if (result.ok) {
          setBook(result.data);
          setEditForm({
            title: result.data.title,
            author: result.data.author,
            numberOfPages: result.data.numberOfPages,
            isbn: result.data.isbn || "",
            rating: result.data.rating || 0,
            review: result.data.review || "",
          });
          // TODO: Načíst záznamy o čtení
        } else {
          showError(result.error.code, result.error.message);
          navigate("/");
        }
      } catch (error) {
        showError("failedToLoad", "Failed to load book detail");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadBookDetail();
  }, [id, navigate, showError, handlerMap]);

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
          setBook(bookResult.data);
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
      const result = await handlerMap.handleDelete({ id: book.id });
      if (result.ok) {
        showToast("success", null, "book_deleted");
        navigate("/");
      } else {
        showError(result.error);
      }
    } catch (error) {
      showError({ code: "unexpectedError", message: error.message });
    }
  };

  const handleMarkFinished = async () => {
    const result = await handleStatusChange({
      ...book,
      finished: true,
    });
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

  if (loading || !book) {
    return null; // TODO: Add loading spinner
  }

  return (
    <>
      {!loading && (
        <>
          <BookHeader title={book.title} onBack={() => navigate("/")} />
          <Row>
            <Col>
              <BookInfo
                book={book}
                isEditing={isEditing}
                editForm={editForm}
                onEditToggle={() => setIsEditing(!isEditing)}
                onEditFormChange={(changes) =>
                  setEditForm({ ...editForm, ...changes })
                }
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                validated={validated}
                onShowFinishedModal={() => setShowFinishedModal(true)}
                onShowUnfinishedModal={() => setShowUnfinishedModal(true)}
                onDelete={() => setShowDeleteModal(true)}
              />
              <BookReadingRecords records={readingRecords} />
            </Col>
          </Row>

          <MarkFinishedModal
            show={showFinishedModal}
            onHide={() => setShowFinishedModal(false)}
            onConfirm={handleMarkFinished}
            book={book}
          />

          <MarkUnfinishedModal
            show={showUnfinishedModal}
            onHide={() => setShowUnfinishedModal(false)}
            onConfirm={handleMarkUnfinished}
            book={book}
          />

          <ConfirmModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title={t("books.confirm_delete")}
            message={t("books.confirm_delete_message", { title: book?.title })}
            confirmButtonVariant="danger"
            confirmButtonText={t("books.delete_book")}
          />
        </>
      )}
    </>
  );
};

export default BookDetailPage;