import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../common/ConfirmModal";
import ReadingRecordForm from "./ReadingRecordForm";

const EditReadingRecordModal = ({
  show,
  onHide,
  onConfirm,
  totalPages,
  currentReadPages,
  record,
}) => {
  const { t } = useTranslation();
  const [validated, setValidated] = useState(false);
  const [readPagesError, setReadPagesError] = useState("");
  const maxPagesToRead =
    totalPages - (currentReadPages - record?.readPages || 0);

  const formatDateForInput = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    const form = document.getElementById("editReadingRecordForm");
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);
    const readPages = parseInt(values.readPages, 10);

    if (!readPages || readPages < 1) {
      setValidated(true);
      return;
    }

    if (readPages > maxPagesToRead) {
      setReadPagesError(
        t("reading_records.read_pages_max_exceeded", { max: maxPagesToRead })
      );
      setValidated(true);
      return;
    }

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    setReadPagesError("");
    onConfirm({
      id: record.id,
      readPages,
      readingTime: values.readingTime,
      date: values.date.split("-").reverse().join("/"),
      note: values.note || undefined,
    });
  };

  const handleClose = () => {
    setValidated(false);
    setReadPagesError("");
    onHide();
  };

  const handleReadPagesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > maxPagesToRead) {
      setReadPagesError(
        t("reading_records.read_pages_max_exceeded", { max: maxPagesToRead })
      );
    } else {
      setReadPagesError("");
    }
  };

  return (
    <ConfirmModal
      show={show}
      onHide={handleClose}
      onConfirm={handleSubmit}
      title={t("reading_records.edit")}
      confirmButtonText={t("common.save")}
    >
      <ReadingRecordForm
        formId="editReadingRecordForm"
        validated={validated}
        readPagesError={readPagesError}
        defaultValues={{
          readPages: record?.readPages,
          readingTime: record?.readingTime,
          date: record ? formatDateForInput(record.date) : "",
          note: record?.note,
        }}
        onReadPagesChange={handleReadPagesChange}
      />
    </ConfirmModal>
  );
};

export default EditReadingRecordModal;
