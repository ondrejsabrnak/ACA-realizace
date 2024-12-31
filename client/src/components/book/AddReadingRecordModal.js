import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ConfirmModal from "../common/ConfirmModal";

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
        t("books.read_pages_max_exceeded", { max: maxPagesToRead })
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
        t("books.read_pages_max_exceeded", { max: maxPagesToRead })
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
      title={t("books.add_reading_record")}
      confirmButtonText={t("common.save")}
    >
      <Form id="addReadingRecordForm" noValidate validated={validated}>
        <Form.Group className="mb-3">
          <Form.Label>
            {t("books.read_pages")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="number"
            name="readPages"
            min="1"
            max={maxPagesToRead}
            required
            isInvalid={!!readPagesError}
            onChange={handleReadPagesChange}
          />
          <Form.Text className="text-muted">
            max. {maxPagesToRead} {t("books.pages")}
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            {readPagesError || t("books.read_pages_required")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            {t("books.reading_time")} <span className="text-danger">*</span>
          </Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              name="readingTime"
              pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
              placeholder="00:30"
              required
            />
            <Form.Control.Feedback type="invalid">
              {t("books.reading_time_required")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            {t("books.date")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="date"
            name="date"
            required
            defaultValue={getTodayDate()}
          />
          <Form.Control.Feedback type="invalid">
            {t("books.date_required")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("books.note")}</Form.Label>
          <Form.Control as="textarea" name="note" rows={3} />
        </Form.Group>
      </Form>
    </ConfirmModal>
  );
};

export default AddReadingRecordModal;
