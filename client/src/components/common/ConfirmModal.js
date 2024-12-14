import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title,
  children,
  confirmButtonText
}) => {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {children}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide}>
          {t("common.cancel")}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmButtonText || t("common.confirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;