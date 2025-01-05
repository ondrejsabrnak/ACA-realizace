import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { BookStarRating } from "..";
import ConfirmModal from "../../common/ConfirmModal";
import { BookListContext } from "../../../providers/BookListProvider";
import { useToast } from "../../../providers/ToastProvider";

const BookFinishedModal = ({ show, onHide, book }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const { handlerMap } = useContext(BookListContext);
  const { showToast, showError } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) return;

    const form = document.getElementById("finishBookForm");
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);

    try {
      const result = await handlerMap.handleUpdate({
        id: book.id,
        finished: true,
        rating: rating,
        ...(values.review && { review: values.review }),
      });

      if (result.ok) {
        const bookResult = await handlerMap.handleGet({ id: book.id });
        if (bookResult.ok) {
          showToast("success", null, "book_marked_finished");
          handleClose();
        }
      } else {
        showError(result.error.code, result.error.message);
      }
    } catch (error) {
      showError("failedToUpdateBook", "Failed to update book");
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
