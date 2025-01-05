import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../common/ConfirmModal";
import { ReadingRecordListContext } from "../../../providers/ReadingRecordListProvider";
import { useErrorHandling } from "../../../hooks/useErrorHandling";

const ReadingRecordDeleteModal = ({ show, onHide, record, bookId }) => {
  const { t } = useTranslation();
  const { handlerMap } = useContext(ReadingRecordListContext);
  const { handleApiResponse } = useErrorHandling();

  const handleDeleteConfirm = async () => {
    if (!record) return;

    await handleApiResponse(
      handlerMap.handleDelete({ bookId, id: record.id }),
      {
        successMessage: "reading_record_deleted",
        successCallback: async () => {
          onHide();
          await handlerMap.handleListByBookId({ bookId });
        },
      }
    );
  };

  if (!record) return null;

  return (
    <ConfirmModal
      show={show}
      onHide={onHide}
      onConfirm={handleDeleteConfirm}
      title={t("reading_records.delete")}
      confirmButtonVariant="danger"
      confirmButtonText={t("common.delete")}
    >
      {t("reading_records.confirm_delete", {
        date: record.date,
        pages: record.pages,
      })}
    </ConfirmModal>
  );
};

export default ReadingRecordDeleteModal;
