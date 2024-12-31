import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ConfirmModal from "../common/ConfirmModal";

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

  const formatDate = (dateString) => {
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
      <Form id="editReadingRecordForm" noValidate validated={validated}>
        <Form.Group className="mb-3">
          <Form.Label>
            {t("reading_records.read_pages")}{" "}
            <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="number"
            name="readPages"
            min="1"
            max={maxPagesToRead}
            required
            isInvalid={!!readPagesError}
            onChange={handleReadPagesChange}
            defaultValue={record?.readPages}
          />
          <Form.Text className="text-muted">
            max. {maxPagesToRead} {t("reading_records.pages")}
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            {readPagesError || t("reading_records.read_pages_required")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            {t("reading_records.reading_time")}{" "}
            <span className="text-danger">*</span>
          </Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              name="readingTime"
              pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
              placeholder="00:30"
              required
              defaultValue={record?.readingTime}
            />
            <Form.Control.Feedback type="invalid">
              {t("reading_records.reading_time_required")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            {t("reading_records.date")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="date"
            name="date"
            required
            defaultValue={record ? formatDate(record.date) : ""}
          />
          <Form.Control.Feedback type="invalid">
            {t("reading_records.date_required")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("reading_records.note")}</Form.Label>
          <Form.Control
            as="textarea"
            name="note"
            rows={3}
            defaultValue={record?.note}
          />
        </Form.Group>
      </Form>
    </ConfirmModal>
  );
};

export default EditReadingRecordModal;
