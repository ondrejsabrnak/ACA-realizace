import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { ReadingRecordForm } from "..";

const ReadingRecordModal = ({
  show,
  onHide,
  onSubmit,
  title,
  submitText,
  totalPages,
  currentReadPages,
  record,
}) => {
  const { t } = useTranslation();
  const [validated, setValidated] = useState(false);
  const [readPagesError, setReadPagesError] = useState("");
  const maxPagesToRead =
    totalPages - currentReadPages + (record?.readPages || 0);

  const validateReadPages = (value) => {
    const pages = parseInt(value, 10);
    if (isNaN(pages) || pages < 1) {
      return t("reading_records.read_pages_required");
    } else if (pages > maxPagesToRead) {
      return t("reading_records.read_pages_max_exceeded", {
        max: maxPagesToRead,
      });
    }
    return "";
  };

  const handleReadPagesChange = (e) => {
    const error = validateReadPages(e.target.value);
    setReadPagesError(error);
    setValidated(!!error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const readPages = formData.get("readPages");

    const error = validateReadPages(readPages);
    if (error) {
      setReadPagesError(error);
      setValidated(true);
      return;
    }

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    onSubmit(Object.fromEntries(formData));
  };

  const handleClose = () => {
    setValidated(false);
    setReadPagesError("");
    onHide();
  };

  const defaultValues = record
    ? {
        readPages: record.readPages,
        readingTime: record.readingTime,
        date: record.date,
        note: record.note,
      }
    : {};

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form
        id="readingRecordForm"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Modal.Body>
          <ReadingRecordForm
            validated={validated}
            readPagesError={readPagesError}
            onReadPagesChange={handleReadPagesChange}
            totalPages={totalPages}
            currentReadPages={currentReadPages}
            defaultValues={defaultValues}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" type="submit">
            {submitText}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReadingRecordModal;
