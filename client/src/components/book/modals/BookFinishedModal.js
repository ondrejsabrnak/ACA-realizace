import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { BookStarRating } from "..";
import ConfirmModal from "../../common/ConfirmModal";

const BookFinishedModal = ({ show, onHide, onConfirm, book }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (rating === 0) return;

    const form = document.getElementById("finishBookForm");
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);

    const result = await onConfirm({
      id: book.id,
      finished: true,
      rating: rating,
      ...(values.review && { review: values.review }),
    });

    if (result?.ok) {
      handleClose();
    }
  };

  const handleClose = () => {
    setRating(0);
    onHide();
  };

  return (
    <ConfirmModal
      show={show}
      onHide={handleClose}
      onConfirm={handleSubmit}
      title={t("books.confirm_status_change")}
      confirmButtonText={t("common.confirm")}
    >
      <Form id="finishBookForm">
        <p className="mb-4">
          {t("books.confirm_mark_finished", { title: book.title })}
        </p>
        <div className="mb-4">
          <p className="fw-bold mb-2">
            {t("books.rating")} <span className="text-danger">*</span>
          </p>
          <BookStarRating rating={rating} onRatingChange={setRating} />
          {rating === 0 && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {t("books.rating_required")}
            </Form.Control.Feedback>
          )}
        </div>

        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">{t("books.review")}</Form.Label>
          <Form.Control
            as="textarea"
            name="review"
            rows={3}
            placeholder={t("books.review_placeholder")}
          />
        </Form.Group>
      </Form>
    </ConfirmModal>
  );
};

export default BookFinishedModal;
