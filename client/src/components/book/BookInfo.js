import React from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import BookStatusToggle from "./BookStatusToggle";
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
}) => {
  const { t } = useTranslation();

  const renderBookInfo = () => (
    <Form noValidate validated={validated} onSubmit={onSubmit}>
      <dl className="row mb-0">
        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.title")}
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Control
              required
              type="text"
              value={editForm.title}
              onChange={(e) => onEditFormChange({ title: e.target.value })}
              placeholder={t("books.title_placeholder")}
              maxLength={100}
              minLength={1}
            />
          ) : (
            book.title
          )}
        </dd>

        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.author")}
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Control
              required
              type="text"
              value={editForm.author}
              onChange={(e) => onEditFormChange({ author: e.target.value })}
              placeholder={t("books.author_placeholder")}
              maxLength={100}
              minLength={1}
            />
          ) : (
            book.author
          )}
        </dd>

        <dt className="col-sm-3 d-flex align-items-center">
          {t("books.number_of_pages")}
        </dt>
        <dd className="col-sm-9">
          {isEditing ? (
            <Form.Control
              required
              type="number"
              value={editForm.numberOfPages}
              onChange={(e) =>
                onEditFormChange({ numberOfPages: e.target.value })
              }
              placeholder={t("books.pages_placeholder")}
              min={1}
              max={10000}
            />
          ) : (
            `${book.pagesRead}/${book.numberOfPages} ${t("books.pages_read")}`
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
              placeholder={t("books.isbn_placeholder")}
              pattern="^\d{9}[\dX]$|^\d{13}$"
            />
          ) : (
            book.isbn || <span className="text-muted">Nezadáno</span>
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

        {isEditing && (
          <dd className="col-12 mt-4">
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                {t("books.save_changes")}
              </Button>
              <Button variant="secondary" onClick={onCancel}>
                {t("common.cancel")}
              </Button>
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
          <div className="d-flex align-items-center gap-2">
            <Card.Title className="mb-0">{t("books.book_info")}</Card.Title>
            <Button
              variant="link"
              className="p-0 text-primary"
              onClick={onEditToggle}
              title={t("books.edit_book")}
            >
              <i className="bi bi-pencil fs-5"></i>
            </Button>
          </div>
          <BookStatusToggle
            finished={book.finished}
            onStatusChange={() =>
              book.finished ? onShowUnfinishedModal() : onShowFinishedModal()
            }
          />
        </div>
        {renderBookInfo()}
      </Card.Body>
    </Card>
  );
};

export default BookInfo;
