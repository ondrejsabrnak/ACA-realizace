import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../common/ConfirmModal";
import ReadingRecordForm from "./ReadingRecordForm";

const AddReadingRecordModal = ({
  show,
  onHide,
  onConfirm,
  totalPages,
  currentReadPages,
}) => {
  const { t } = useTranslation();
  const [validated, setValidated] = useState(false);
  const [readPagesError, setReadPagesError] = useState("");
  const maxPagesToRead = totalPages - currentReadPages;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    const form = document.getElementById("addReadingRecordForm");
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
      readPages,
      readingTime: values.readingTime,
      date: formatDate(values.date),
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
      title={t("reading_records.add")}
      confirmButtonText={t("common.save")}
    >
      <ReadingRecordForm
        formId="addReadingRecordForm"
        validated={validated}
        readPagesError={readPagesError}
        defaultValues={{ date: getTodayDate() }}
        onReadPagesChange={handleReadPagesChange}
      />
    </ConfirmModal>
  );
};

export default AddReadingRecordModal;
