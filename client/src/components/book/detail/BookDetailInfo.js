import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BookStarRating } from "..";
import { BookListContext } from "../../../providers/BookListProvider";
import { validateIsbn } from "../../../utils/isbnValidation";

const BookDetailInfo = ({
  book,
  isEditing,
  editForm,
  onEditToggle,
  onEditFormChange,
  onSubmit,
  onCancel,
  validated,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { handlerMap } = useContext(BookListContext);
  const [isbnError, setIsbnError] = useState("");

  const handleIsbnChange = (e) => {
    const value = e.target.value;
    if (value && !validateIsbn(value)) {
      setIsbnError(t("books.isbn_invalid"));
    } else {
      setIsbnError("");
    }
    onEditFormChange(e);
  };

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();

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

    onSubmit(e);
  };

  const renderBookDetailInfo = () => (
    <Form
      noValidate
      validated={validated}
      onSubmit={handleSubmitWithValidation}
    >
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
              onChange={(e) => onEditFormChange(e)}
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
              onChange={(e) => onEditFormChange(e)}
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
              onChange={(e) => onEditFormChange(e)}
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
                          onEditFormChange({
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
                  onChange={(e) => onEditFormChange(e)}
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
                onClick={onDelete}
              >
                <i className="bi bi-trash"></i>
                {t("common.delete")}
              </Button>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" onClick={onCancel}>
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
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">{t("books.book_info")}</Card.Title>
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-flex align-items-center"
            onClick={onEditToggle}
            title={t("books.edit_book")}
          >
            <i className="bi bi-pencil me-2"></i>
            {t("books.edit_book")}
          </Button>
        </div>
        {renderBookDetailInfo()}
      </Card.Body>
    </Card>
  );
};

export default BookDetailInfo;
