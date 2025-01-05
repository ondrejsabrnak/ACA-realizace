import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../common/ConfirmModal";
import { BookListContext } from "../../../providers/BookListProvider";
import { useToast } from "../../../providers/ToastProvider";

const BookUnfinishedModal = ({ show, onHide, book }) => {
  const { t } = useTranslation();
  const { handlerMap } = useContext(BookListContext);
  const { showToast, showError } = useToast();

  const handleSubmit = async () => {
    try {
      const result = await handlerMap.handleUpdate({
        id: book.id,
        finished: false,
        rating: undefined,
        review: undefined,
      });

      if (result.ok) {
        const bookResult = await handlerMap.handleGet({ id: book.id });
        if (bookResult.ok) {
          showToast("success", null, "book_marked_unfinished");
          onHide();
        }
      } else {
        showError(result.error.code, result.error.message);
      }
    } catch (error) {
      showError("failedToUpdateBook", "Failed to update book");
    }
  };

  return (
    <ConfirmModal
      show={show}
      onHide={onHide}
      onConfirm={handleSubmit}
      title={t("books.confirm_status_change")}
      confirmButtonText={t("common.confirm")}
    >
      {t("books.confirm_mark_unfinished", { title: book.title })}
    </ConfirmModal>
  );
};

export default BookUnfinishedModal;
