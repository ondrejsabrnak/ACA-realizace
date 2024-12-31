import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useError } from "../providers/ErrorProvider";
import { useToast } from "../providers/ToastProvider";
import FetchHelper from "../helpers/FetchHelper";
import MarkFinishedModal from "../components/book/MarkFinishedModal";
import MarkUnfinishedModal from "../components/book/MarkUnfinishedModal";
import BookHeader from "../components/book/BookHeader";
import BookInfo from "../components/book/BookInfo";
import BookReadingRecords from "../components/book/BookReadingRecords";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useError();
  const { showToast } = useToast();
  const [book, setBook] = useState(null);
  const [readingRecords, setReadingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [showUnfinishedModal, setShowUnfinishedModal] = useState(false);
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
      const result = await FetchHelper.book.update({
        id: book.id,
        ...updatedBook,
      });

      if (result.ok) {
        setBook(result.data.data);
        setEditForm({
          title: result.data.data.title,
          author: result.data.data.author,
          numberOfPages: result.data.data.numberOfPages,
          isbn: result.data.data.isbn || "",
          rating: result.data.data.rating || 0,
          review: result.data.data.review || "",
        });
        showToast(
          "success",
          null,
          updatedBook.finished
            ? "book_marked_finished"
            : "book_marked_unfinished"
        );
        return result;
      } else {
        showError(result.data.error.code, result.data.error.message);
      }
    } catch (error) {
      showError("failedToUpdateBook", "Failed to update book");
    }
  };

  useEffect(() => {
    const loadBookDetail = async () => {
      try {
        const result = await FetchHelper.book.get({ id });
        if (result.ok) {
          setBook(result.data.data);
          setEditForm({
            title: result.data.data.title,
            author: result.data.data.author,
            numberOfPages: result.data.data.numberOfPages,
            isbn: result.data.data.isbn || "",
            rating: result.data.data.rating || 0,
            review: result.data.data.review || "",
          });
          // TODO: Načíst záznamy o čtení
        } else {
          showError(result.data.error.code, result.data.error.message);
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
  }, [id, navigate, showError]);

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

      const result = await FetchHelper.book.update(updateData);

      if (result.ok) {
        setBook(result.data.data);
        setIsEditing(false);
        setValidated(false);
        showToast("success", null, "book_updated");
      } else {
        showError(
          result.data.error.code,
          result.data.error.message,
          result.data.error.details
        );
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

  if (loading || !book) {
    return null; // TODO: Add loading spinner
  }

  return (
    <div>
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
          />

          <BookReadingRecords records={readingRecords} />
        </Col>
      </Row>

      <MarkFinishedModal
        show={showFinishedModal}
        onHide={() => setShowFinishedModal(false)}
        onConfirm={handleStatusChange}
        book={book}
      />

      <MarkUnfinishedModal
        show={showUnfinishedModal}
        onHide={() => setShowUnfinishedModal(false)}
        onConfirm={handleStatusChange}
        book={book}
      />
    </div>
  );
};

export default BookDetailPage;
