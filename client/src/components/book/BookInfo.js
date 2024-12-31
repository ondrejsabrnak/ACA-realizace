import React from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import StarRating from "./StarRating";

const BookInfo = ({
  book,
  isEditing,
  editForm,
  onEditToggle,
  onEditFormChange,
  onSubmit,
  onCancel,
  validated,
  onShowFinishedModal,
  onShowUnfinishedModal,
  onDelete,
}) => {
  const { t } = useTranslation();

  const renderBookInfo = () => (
    <Form noValidate validated={validated} onSubmit={onSubmit}>
      <dl className="row mb-0">
        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.title")} <span className="text-danger ms-1">*</span>
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Control
              type="text"
              value={editForm.title}
              onChange={(e) => onEditFormChange({ title: e.target.value })}
              required
            />
          ) : (
            book.title
          )}
        </dd>

        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.author")} <span className="text-danger ms-1">*</span>
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Control
              type="text"
              value={editForm.author}
              onChange={(e) => onEditFormChange({ author: e.target.value })}
              required
            />
          ) : (
            book.author
          )}
        </dd>

        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.total_pages")} <span className="text-danger ms-1">*</span>
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Control
              type="number"
              value={editForm.numberOfPages}
              onChange={(e) =>
                onEditFormChange({ numberOfPages: e.target.value })
              }
              required
              min="1"
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
            <Form.Control
              type="text"
              value={editForm.isbn}
              onChange={(e) => onEditFormChange({ isbn: e.target.value })}
              placeholder={t("common.not_specified")}
            />
          ) : (
            book.isbn || (
              <span className="text-muted">{t("common.not_specified")}</span>
            )
          )}
        </dd>

        {book.finished && (
          <>
            <dt className="col-sm-3 d-flex align-items-center">
              {t("books.rating")}
            </dt>
            <dd className="col-sm-9">
              <div className={isEditing ? "rating-edit-mode" : ""}>
                <StarRating
                  rating={isEditing ? editForm.rating : book.rating}
                  readonly={!isEditing}
                  onRatingChange={
                    isEditing
                      ? (value) => onEditFormChange({ rating: value })
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
                  rows={3}
                  value={editForm.review}
                  onChange={(e) => onEditFormChange({ review: e.target.value })}
                  placeholder={t("books.review_placeholder")}
                />
              ) : (
                book.review || <span className="text-muted">Nezadáno</span>
              )}
            </dd>
          </>
        )}

        {isEditing ? (
          <dd className="col-12 mt-4">
            <div className="d-flex gap-2 justify-content-between">
              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  {t("books.save_changes")}
                </Button>
                <Button variant="outline-secondary" onClick={onCancel}>
                  {t("common.cancel")}
                </Button>
              </div>
              <Button
                variant="outline-danger"
                className="d-flex align-items-center gap-2"
                onClick={onDelete}
              >
                <i className="bi bi-trash"></i>
                {t("books.delete_book")}
              </Button>
            </div>
          </dd>
        ) : null}
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
        {renderBookInfo()}
      </Card.Body>
    </Card>
  );
};

export default BookInfo;
