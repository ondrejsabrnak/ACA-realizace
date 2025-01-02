import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getTodayDate,
  formatDateForInput,
  formatDateForApi,
} from "../utils/dateUtils";

export const useReadingRecordForm = ({
  mode = "add",
  record,
  totalPages,
  currentReadPages,
  onSubmit,
  onClose,
}) => {
  const { t } = useTranslation();
  const [validated, setValidated] = useState(false);
  const [readPagesError, setReadPagesError] = useState("");

  const maxPagesToRead = totalPages - currentReadPages;

  const handleSubmit = async () => {
    const form = document.getElementById(
      mode === "add" ? "addReadingRecordForm" : "editReadingRecordForm"
    );

    if (!form.checkValidity() || readPagesError) {
      setValidated(true);
      return;
    }

    const formData = new FormData(form);
    const values = Object.fromEntries(formData);

    const result = await onSubmit({
      ...values,
      readPages: parseInt(values.readPages, 10),
      date: formatDateForApi(values.date),
    });

    if (result?.ok) {
      handleClose();
    }
  };

  const handleClose = () => {
    setValidated(false);
    setReadPagesError("");
    onClose();
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

  return {
    validated,
    readPagesError,
    handleSubmit,
    handleClose,
    handleReadPagesChange,
    getDefaultValues,
    maxPagesToRead,
  };
};
