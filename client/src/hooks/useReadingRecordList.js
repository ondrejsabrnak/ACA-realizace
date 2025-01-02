import { useState, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ReadingRecordListContext } from "../providers/ReadingRecordListProvider";
import { BookListContext } from "../providers/BookListProvider";
import { useErrorHandling } from "./useErrorHandling";

export const useReadingRecordList = ({ bookId, onRecordChange }) => {
  const { t } = useTranslation();
  const { state, data, error, currentBookId, handlerMap } = useContext(
    ReadingRecordListContext
  );
  const { handlerMap: bookHandlerMap } = useContext(BookListContext);
  const { handleApiResponse } = useErrorHandling();

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const currentReadPages = useMemo(() => {
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
    const handler =
      modalMode === "add" ? handlerMap.handleCreate : handlerMap.handleUpdate;
    const payload =
      modalMode === "add"
        ? { bookId, ...formData }
        : {
            id: recordToEdit.id,
            readPages: parseInt(formData.readPages, 10),
            readingTime: formData.readingTime,
            date: formData.date,
            note: formData.note,
          };

    const result = await handleApiResponse(handler(payload), {
      successMessage:
        modalMode === "add"
          ? "reading_record_created"
          : "reading_record_updated",
      successCallback: async () => {
        handleModalClose();
        if (onRecordChange) {
          onRecordChange();
        }
        await bookHandlerMap.handleLoad();
        await handlerMap.handleListByBookId({ bookId });
      },
    });

    return result;
  };

  const handleDeleteRecord = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    await handleApiResponse(
      handlerMap.handleDelete({ bookId, id: recordToDelete.id }),
      {
        successMessage: "reading_record_deleted",
        successCallback: async () => {
          setShowDeleteModal(false);
          setRecordToDelete(null);
          if (onRecordChange) {
            onRecordChange();
          }
          await bookHandlerMap.handleLoad();
        },
      }
    );
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  return {
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
  };
};
