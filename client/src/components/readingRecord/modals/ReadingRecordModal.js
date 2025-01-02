import React from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../common/ConfirmModal";
import ReadingRecordForm from "../components/ReadingRecordForm";
import { useReadingRecordForm } from "../../../hooks/useReadingRecordForm";

const ReadingRecordModal = ({
  show,
  onHide,
  onConfirm,
  totalPages,
  currentReadPages,
  record,
  mode = "add",
}) => {
  const { t } = useTranslation();
  const {
    validated,
    readPagesError,
    handleSubmit,
    handleClose,
    handleReadPagesChange,
    getDefaultValues,
  } = useReadingRecordForm({
    mode,
    record,
    totalPages,
    currentReadPages,
    onSubmit: onConfirm,
    onClose: onHide,
  });

  return (
    <ConfirmModal
      show={show}
      onHide={handleClose}
      onConfirm={handleSubmit}
      title={t(mode === "add" ? "reading_records.add" : "reading_records.edit")}
      confirmButtonText={t(mode === "add" ? "common.add" : "common.edit")}
    >
      <ReadingRecordForm
        formId={
          mode === "add" ? "addReadingRecordForm" : "editReadingRecordForm"
        }
        validated={validated}
        readPagesError={readPagesError}
        defaultValues={getDefaultValues()}
        onReadPagesChange={handleReadPagesChange}
      />
    </ConfirmModal>
  );
};

export default ReadingRecordModal;
