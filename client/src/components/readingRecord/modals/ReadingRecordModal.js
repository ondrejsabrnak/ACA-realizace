import React from "react";
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

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          onSubmit(Object.fromEntries(formData));
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReadingRecordForm
            totalPages={totalPages}
            currentReadPages={currentReadPages}
            record={record}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
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
