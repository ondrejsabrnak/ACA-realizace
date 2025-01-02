import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { ReadingRecordListContext } from "../../../providers/ReadingRecordListProvider";
import { BookListContext } from "../../../providers/BookListProvider";
import {
  ReadingRecordList,
  ReadingRecordModal,
  ReadingRecordLoading,
  ReadingRecordError,
  ReadingRecordHeader,
} from "..";
import ConfirmModal from "../../common/ConfirmModal";
import { useToast } from "../../../providers/ToastProvider";

const ReadingRecordContainer = ({ bookId, totalPages = 0, onRecordChange }) => {
  const { t } = useTranslation();
  const { state, data, error, currentBookId, handlerMap } = useContext(
    ReadingRecordListContext
  );
  const { handlerMap: bookHandlerMap } = useContext(BookListContext);
  const { showToast, showError } = useToast();

  // Modal states
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const currentReadPages = React.useMemo(() => {
    if (!data?.data?.items) return 0;
    return data.data.items.reduce((sum, record) => sum + record.readPages, 0);
  }, [data?.data?.items]);

  useEffect(() => {
    if (bookId && bookId !== currentBookId) {
      handlerMap.handleListByBookId({ bookId });
    }
  }, [bookId, currentBookId, handlerMap]);

  const handleModalClose = () => {
    setShowRecordModal(false);
    setRecordToEdit(null);
    setModalMode("add");
  };

  const handleAddRecord = () => {
    setModalMode("add");
    setShowRecordModal(true);
  };

  const handleEditRecord = (record) => {
    setRecordToEdit(record);
    setModalMode("edit");
    setShowRecordModal(true);
  };

  const handleRecordSubmit = async (formData) => {
    try {
      const handler =
        modalMode === "add" ? handlerMap.handleCreate : handlerMap.handleUpdate;
      let payload;

      if (modalMode === "add") {
        payload = {
          bookId,
          ...formData,
        };
      } else {
        // For edit mode, we only need the record data without bookId
        payload = {
          id: recordToEdit.id,
          readPages: parseInt(formData.readPages, 10),
          readingTime: formData.readingTime,
          date: formData.date,
          note: formData.note,
        };
      }

      const result = await handler(payload);

      if (result?.ok) {
        handleModalClose();
        showToast(
          "success",
          null,
          modalMode === "add"
            ? "reading_record_created"
            : "reading_record_updated"
        );
        if (onRecordChange) {
          onRecordChange();
        }
        await bookHandlerMap.handleLoad();
        // Refresh the reading records list
        await handlerMap.handleListByBookId({ bookId });
      } else {
        const errorCode = result?.error?.code || "unexpectedError";
        const errorMessage =
          result?.error?.message ||
          (result?.error
            ? JSON.stringify(result.error)
            : "An unexpected error occurred");
        showError(errorCode, errorMessage);
      }
    } catch (error) {
      showError(
        "unexpectedError",
        error?.message || "An unexpected error occurred"
      );
    }
  };

  const handleDeleteRecord = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    try {
      const result = await handlerMap.handleDelete({
        bookId,
        id: recordToDelete.id,
      });

      if (result?.ok) {
        showToast("success", null, "reading_record_deleted");
        setShowDeleteModal(false);
        setRecordToDelete(null);
        if (onRecordChange) {
          onRecordChange();
        }
        await bookHandlerMap.handleLoad();
      } else {
        const errorCode = result?.error?.code || "unexpectedError";
        const errorMessage =
          result?.error?.message || t("errors.unexpectedError");
        showError(errorCode, errorMessage);
      }
    } catch (error) {
      showError(
        "unexpectedError",
        error?.message || t("errors.unexpectedError")
      );
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

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
            pages: recordToDelete.readPages,
          })}
      </ConfirmModal>
    </>
  );
};

export default ReadingRecordContainer;
