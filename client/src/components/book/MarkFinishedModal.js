import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";
import ConfirmModal from "../common/ConfirmModal";

const MarkFinishedModal = ({ show, onHide, onConfirm, book }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [validated, setValidated] = useState(false);

  const handleConfirm = () => {
    if (rating === 0) {
      setValidated(true);
      return;
    }
    onConfirm({ rating, review });
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    setValidated(false);
    onHide();
  };

  return (
    <ConfirmModal
      show={show}
      onHide={handleClose}
      onConfirm={handleConfirm}
      title={t("books.confirm_status_change")}
      confirmButtonText={t("books.mark_finished")}
    >
      <Form noValidate validated={validated}>
        <p className="mb-4">
          {t("books.confirm_mark_finished", { title: book.title })}
        </p>
        <div className="mb-4">
          <p className="fw-bold mb-2">{t("books.rating")}</p>
          <StarRating rating={rating} onRatingChange={setRating} />
          {validated && rating === 0 && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {t("books.rating_required")}
            </Form.Control.Feedback>
          )}
        </div>

        <Form.Group>
          <Form.Label className="fw-bold">{t("books.review")}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={t("books.review_placeholder")}
          />
        </Form.Group>
      </Form>
    </ConfirmModal>
  );
};

export default MarkFinishedModal;
