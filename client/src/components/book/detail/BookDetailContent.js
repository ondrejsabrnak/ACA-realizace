import React from "react";
import { useTranslation } from "react-i18next";
import {
  BookDetailInfo,
  BookDetailProgress,
  BookDetailRecords,
  BookFinishedModal,
  BookUnfinishedModal,
} from "..";
import ConfirmModal from "../../common/ConfirmModal";

const BookDetailContent = ({
  book,
  isEditing,
  editForm,
  onEditToggle,
  onEditFormChange,
  onEditSubmit,
  onEditCancel,
  validated,
  onDelete,
  onShowFinishedModal,
  onShowUnfinishedModal,
  totalPages,
  onRecordChange,
  showFinishedModal,
  showUnfinishedModal,
  showDeleteModal,
  onHideFinishedModal,
  onHideUnfinishedModal,
  onHideDeleteModal,
  onMarkFinished,
  onMarkUnfinished,
  isDeleting,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <BookDetailInfo
        book={book}
        isEditing={isEditing}
        editForm={editForm}
        onEditToggle={onEditToggle}
        onEditFormChange={onEditFormChange}
        onSubmit={onEditSubmit}
        onCancel={onEditCancel}
        validated={validated}
        onDelete={onDelete}
      />

      <BookDetailProgress
        book={book}
        onShowFinishedModal={onShowFinishedModal}
        onShowUnfinishedModal={onShowUnfinishedModal}
      />

      <BookDetailRecords
        bookId={book.id}
        totalPages={totalPages}
        onRecordChange={onRecordChange}
      />

      <BookFinishedModal
        show={showFinishedModal}
        onHide={onHideFinishedModal}
        onConfirm={onMarkFinished}
        book={book}
      />

      <BookUnfinishedModal
        show={showUnfinishedModal}
        onHide={onHideUnfinishedModal}
        onConfirm={onMarkUnfinished}
        book={book}
      />

      <ConfirmModal
        show={showDeleteModal}
        onHide={onHideDeleteModal}
        onConfirm={onDelete}
        title={t("books.delete_book")}
        confirmButtonVariant="danger"
        confirmButtonText={t("common.delete")}
        isLoading={isDeleting}
      >
        {t("books.confirm_delete_message", { title: book.title })}
      </ConfirmModal>
    </>
  );
};

export default BookDetailContent;
