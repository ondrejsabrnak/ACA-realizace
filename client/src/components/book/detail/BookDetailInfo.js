import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BookStarRating, BookDeleteModal } from "..";
import { BookListContext } from "../../../providers/BookListProvider";
import { useToast } from "../../../providers/ToastProvider";
import { validateIsbn } from "../../../utils/isbnValidation";

const BookDetailInfo = ({ book }) => {
  const { t } = useTranslation();
  const { handlerMap } = useContext(BookListContext);
  const { showToast, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isbnError, setIsbnError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: book.title,
    author: book.author,
    numberOfPages: book.numberOfPages,
    isbn: book.isbn || "",
    rating: book.rating || 0,
    review: book.review || "",
  });

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIsbnChange = (e) => {
    const value = e.target.value;
    if (value && !validateIsbn(value)) {
      setIsbnError(t("books.isbn_invalid"));
    } else {
      setIsbnError("");
    }
    handleEditFormChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    // Validate ISBN if provided
    if (editForm.isbn) {
      if (!validateIsbn(editForm.isbn)) {
        setIsbnError(t("books.isbn_invalid"));
        return;
      }
      // Check uniqueness only if ISBN changed
      if (editForm.isbn !== book.isbn) {
        const isUnique = handlerMap.checkIsbnUnique(editForm.isbn);
        if (!isUnique) {
          setIsbnError(t("books.isbn_exists"));
          return;
        }
      }
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
    setIsbnError("");
  };

  const renderBookDetailInfo = () => (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <dl className="row mb-0">
        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.title")}{" "}
          {isEditing && <span className="text-danger ms-1">*</span>}
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Control
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleEditFormChange}
              required
              maxLength={100}
              minLength={1}
            />
          ) : (
            book.title
          )}
        </dd>

        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.author")}{" "}
          {isEditing && <span className="text-danger ms-1">*</span>}
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Control
              type="text"
              name="author"
              value={editForm.author}
              onChange={handleEditFormChange}
              required
              maxLength={100}
              minLength={1}
            />
          ) : (
            book.author
          )}
        </dd>

        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.total_pages")}{" "}
          {isEditing && <span className="text-danger ms-1">*</span>}
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Control
              type="number"
              name="numberOfPages"
              value={editForm.numberOfPages}
              onChange={handleEditFormChange}
              required
              min={1}
              max={10000}
            />
          ) : (
            book.numberOfPages
          )}
        </dd>

        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.isbn")}
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Group>
              <Form.Control
                type="text"
                name="isbn"
                value={editForm.isbn}
                onChange={handleIsbnChange}
                isInvalid={!!isbnError}
                placeholder={t("books.isbn_placeholder")}
              />
              <Form.Control.Feedback type="invalid">
                {isbnError}
              </Form.Control.Feedback>
            </Form.Group>
          ) : book.isbn ? (
            book.isbn
          ) : (
            <span className="text-muted">{t("common.not_specified")}</span>
          )}
        </dd>

        {book.finished && (
          <>
            <dt className="col-sm-3 d-flex align-items-center">
              {t("books.rating")}
            </dt>
            <dd className="col-sm-9">
              <div className={isEditing ? "rating-edit-mode" : ""}>
                <BookStarRating
                  rating={isEditing ? editForm.rating : book.rating}
                  readonly={!isEditing}
                  onRatingChange={
                    isEditing
                      ? (value) =>
                          handleEditFormChange({
                            target: { name: "rating", value },
                          })
                      : undefined
                  }
                />
              </div>
            </dd>

            <dt className="col-sm-3 d-flex align-items-center">
              {t("books.review")}
            </dt>
            <dd className="col-sm-9">
              {isEditing ? (
                <Form.Control
                  as="textarea"
                  name="review"
                  rows={3}
                  value={editForm.review}
                  onChange={handleEditFormChange}
                  placeholder={t("books.review_placeholder")}
                />
              ) : (
                book.review || (
                  <span className="text-muted">
                    {t("common.not_specified")}
                  </span>
                )
              )}
            </dd>
          </>
        )}

        {isEditing && (
          <dd className="col-12 mt-4">
            <div className="d-flex gap-2 justify-content-between">
              <Button
                variant="outline-danger"
                className="d-flex align-items-center gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <i className="bi bi-trash"></i>
                {t("common.delete")}
              </Button>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" onClick={handleCancel}>
                  {t("common.cancel")}
                </Button>
                <Button variant="primary" type="submit">
                  {t("common.save")}
                </Button>
              </div>
            </div>
          </dd>
        )}
      </dl>
    </Form>
  );

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">{t("books.book_info")}</Card.Title>
            <Button
              variant="outline-secondary"
              size="sm"
              className="d-flex align-items-center"
              onClick={() => setIsEditing(!isEditing)}
              title={t("books.edit_book")}
            >
              <i className="bi bi-pencil me-2"></i>
              {t("books.edit_book")}
            </Button>
          </div>
          {renderBookDetailInfo()}
        </Card.Body>
      </Card>

      <BookDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        book={book}
      />
    </>
  );
};

export default BookDetailInfo;
