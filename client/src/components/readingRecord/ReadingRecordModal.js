import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../common/ConfirmModal";
import ReadingRecordForm from "./ReadingRecordForm";

const ReadingRecordModal = ({
  show,
  onHide,
  onConfirm,
  totalPages,
  currentReadPages,
  record,
  mode = "add", // "add" or "edit"
}) => {
  const { t } = useTranslation();
  const [validated, setValidated] = useState(false);
  const [readPagesError, setReadPagesError] = useState("");

  const maxPagesToRead =
    mode === "edit"
      ? totalPages - (currentReadPages - (record?.readPages || 0))
      : totalPages - currentReadPages;

  const formatDate = (dateString) => {
    // Always format date as DD/MM/YYYY for API
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

  const formatDateForInput = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    const formId =
      mode === "add" ? "addReadingRecordForm" : "editReadingRecordForm";
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);
    const readPages = parseInt(values.readPages, 10);

    console.log("Modal - Raw Form Values:", values);

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
    const formattedData = {
      readPages,
      readingTime: values.readingTime,
      date: formatDate(values.date),
      note: values.note || undefined,
    };

    // For edit mode, include only the record ID
    if (mode === "edit" && record) {
      formattedData.id = record.id;
    }

    console.log("Modal - Record:", record);
    console.log("Modal - Mode:", mode);
    console.log("Modal - Formatted Data:", formattedData);
    onConfirm(formattedData);
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

  const getDefaultValues = () => {
    if (mode === "add") {
      return { date: getTodayDate() };
    }
    return {
      readPages: record?.readPages,
      readingTime: record?.readingTime,
      date: record ? formatDateForInput(record.date) : "",
      note: record?.note,
    };
  };

  return (
    <ConfirmModal
      show={show}
      onHide={handleClose}
      onConfirm={handleSubmit}
      title={t(mode === "add" ? "reading_records.add" : "reading_records.edit")}
      confirmButtonText={t("common.save")}
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
