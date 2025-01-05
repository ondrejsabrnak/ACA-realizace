import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { ReadingRecordAddModal } from "..";

const ReadingRecordHeader = ({ bookId, totalPages, currentReadPages }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">{t("books.reading_records")}</h2>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-1"></i>
          {t("reading_records.add")}
        </Button>
      </div>

      <ReadingRecordAddModal
        show={showModal}
        onHide={() => setShowModal(false)}
        totalPages={parseInt(totalPages, 10) || 0}
        currentReadPages={currentReadPages || 0}
        bookId={bookId}
      />
    </>
  );
};

export default ReadingRecordHeader;
