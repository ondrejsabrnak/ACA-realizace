import React, { useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ReadingRecordModal } from "..";
import { ReadingRecordListContext } from "../../../providers/ReadingRecordListProvider";
import { useErrorHandling } from "../../../hooks/useErrorHandling";
import { useToast } from "../../../providers/ToastProvider";

const ReadingRecordAddModal = ({
  show,
  onHide,
  bookId,
  totalPages,
  currentReadPages,
}) => {
  const { t } = useTranslation();
  const { handlerMap } = useContext(ReadingRecordListContext);
  const { handleError } = useErrorHandling();
  const { showToast } = useToast();

  const updateData = useCallback(async () => {
    await handlerMap.handleListByBookId({ bookId }, { showLoading: false });
  }, [handlerMap, bookId]);

  const handleSubmit = async (formData) => {
    const data = {
      bookId,
      readPages: parseInt(formData.readPages, 10),
      readingTime: formData.readingTime,
      date: formData.formattedDate,
      ...(formData.note && { note: formData.note }),
    };

    try {
      const result = await handlerMap.handleCreate(data);

      if (result?.ok) {
        // Nejdřív aktualizujeme data
        await updateData();
        // Pak zavřeme modal
        onHide();
        // A nakonec zobrazíme toast
        showToast("success", null, "reading_record_created");
      } else {
        handleError(result?.error, "errors.unexpectedError");
      }
    } catch (error) {
      handleError(error, "errors.unexpectedError");
    }
  };

  return (
    <ReadingRecordModal
      show={show}
      onHide={onHide}
      onSubmit={handleSubmit}
      title={t("reading_records.add")}
      submitText={t("common.add")}
      totalPages={totalPages}
      currentReadPages={currentReadPages}
    />
  );
};

export default ReadingRecordAddModal;
