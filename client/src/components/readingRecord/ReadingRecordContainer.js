import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { ReadingRecordListContext } from "../../providers/ReadingRecordListProvider";
import { BookListContext } from "../../providers/BookListProvider";
import ReadingRecordList from "./ReadingRecordList";
import AddReadingRecordModal from "./AddReadingRecordModal";
import EditReadingRecordModal from "./EditReadingRecordModal";
import ConfirmModal from "../common/ConfirmModal";
import { useToast } from "../../providers/ToastProvider";

const ReadingRecordContainer = ({ bookId, totalPages = 0, onRecordChange }) => {
  const { t } = useTranslation();
  const { state, data, error, currentBookId, handlerMap } = useContext(
    ReadingRecordListContext
  );
  const { handlerMap: bookHandlerMap } = useContext(BookListContext);
  const { showToast, showError } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const currentReadPages = React.useMemo(() => {
    if (!data?.data?.items) return 0;
    return data.data.items.reduce((sum, record) => sum + record.readPages, 0);
  }, [data?.data?.items]);

  useEffect(() => {
    // Only fetch if we have a bookId and it's different from the current one
    if (bookId && bookId !== currentBookId) {
      handlerMap.handleListByBookId({ bookId });
    }
  }, [bookId, currentBookId, handlerMap]);

  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  const handleAddConfirm = async (formData) => {
    const result = await handlerMap.handleCreate({
      bookId,
      ...formData,
    });

    if (result.ok) {
      setShowAddModal(false);
      if (onRecordChange) {
        onRecordChange();
      }
      // Refresh the book list to update progress
      await bookHandlerMap.handleLoad();
    }
    // Error is handled by the provider
  };

  const handleEditRecord = (record) => {
    setRecordToEdit(record);
    setShowEditModal(true);
  };

  const handleEditConfirm = async (formData) => {
    const result = await handlerMap.handleUpdate(formData);

    if (result.ok) {
      setShowEditModal(false);
      setRecordToEdit(null);
      if (onRecordChange) {
        onRecordChange();
      }
      // Refresh the book list to update progress
      await bookHandlerMap.handleLoad();
    }
    // Error is handled by the provider
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

      if (result.ok) {
        showToast("success", null, "reading_record_deleted");
        setShowDeleteModal(false);
        setRecordToDelete(null);
        if (onRecordChange) {
          onRecordChange();
        }
        // Refresh the book list to update progress
        await bookHandlerMap.handleLoad();
      } else {
        showError(result.error.code, result.error.message);
      }
    } catch (error) {
      showError("unexpectedError", error.message);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  const renderContent = () => {
    if (state === "pending") {
      return (
        <div className="text-center p-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">{t("common.loading")}</span>
          </Spinner>
        </div>
      );
    }

    if (state === "error") {
      return (
        <Alert variant="danger">
          {t(`errors.${error.code}`, { defaultValue: error.message })}
        </Alert>
      );
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">
              {t("books.reading_records")}
            </Card.Title>
            <Button variant="primary" size="sm" onClick={handleAddRecord}>
              <i className="bi bi-plus-lg me-1"></i>
              {t("reading_records.add")}
            </Button>
          </div>
          {renderContent()}
        </Card.Body>
      </Card>

      <AddReadingRecordModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onConfirm={handleAddConfirm}
        totalPages={parseInt(totalPages, 10) || 0}
        currentReadPages={currentReadPages}
      />

      <EditReadingRecordModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setRecordToEdit(null);
        }}
        onConfirm={handleEditConfirm}
        totalPages={parseInt(totalPages, 10) || 0}
        currentReadPages={currentReadPages}
        record={recordToEdit}
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
