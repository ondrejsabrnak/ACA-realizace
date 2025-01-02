import React from "react";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { useTranslation } from "react-i18next";
import {
  ReadingRecordList,
  ReadingRecordModal,
  ReadingRecordLoading,
  ReadingRecordError,
  ReadingRecordHeader,
} from "..";
import ConfirmModal from "../../common/ConfirmModal";
import { useReadingRecordList } from "../../../hooks/useReadingRecordList";

const ReadingRecordContainer = ({ bookId, totalPages = 0, onRecordChange }) => {
  const { t } = useTranslation();
  const {
    state,
    data,
    error,
    currentReadPages,
    showRecordModal,
    showDeleteModal,
    modalMode,
    recordToEdit,
    recordToDelete,
    handleModalClose,
    handleAddRecord,
    handleEditRecord,
    handleRecordSubmit,
    handleDeleteRecord,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useReadingRecordList({
    bookId,
    onRecordChange,
  });

  const renderContent = () => {
    if (state === "pending") {
      return <ReadingRecordLoading />;
    }

    if (state === "error") {
      return <ReadingRecordError error={error} />;
    }

    if (!data?.data?.items?.length) {
      return <Alert variant="info">{t("books.no_reading_records")}</Alert>;
    }

    return (
      <ReadingRecordList
        records={data.data.items}
        onEdit={handleEditRecord}
        onDelete={handleDeleteRecord}
      />
    );
  };

  return (
    <>
      <Card className="mt-3">
        <Card.Body>
          <ReadingRecordHeader onAddRecord={handleAddRecord} />
          {renderContent()}
        </Card.Body>
      </Card>

      <ReadingRecordModal
        show={showRecordModal}
        onHide={handleModalClose}
        onConfirm={handleRecordSubmit}
        totalPages={parseInt(totalPages, 10) || 0}
        currentReadPages={currentReadPages}
        record={recordToEdit}
        mode={modalMode}
      />

      <ConfirmModal
        show={showDeleteModal}
        onHide={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={t("reading_records.delete")}
        confirmButtonVariant="danger"
        confirmButtonText={t("common.delete")}
      >
        {recordToDelete &&
          t("reading_records.confirm_delete", {
            date: recordToDelete.date,
            pages: recordToDelete.pages,
          })}
      </ConfirmModal>
    </>
  );
};

export default ReadingRecordContainer;
