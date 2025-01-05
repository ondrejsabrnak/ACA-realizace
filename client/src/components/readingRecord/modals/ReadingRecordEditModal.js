import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReadingRecordModal } from "..";
import { ReadingRecordListContext } from "../../../providers/ReadingRecordListProvider";
import { useErrorHandling } from "../../../hooks/useErrorHandling";

const ReadingRecordEditModal = ({
  show,
  onHide,
  bookId,
  totalPages,
  currentReadPages,
  record,
}) => {
  const { t } = useTranslation();
  const { handlerMap } = useContext(ReadingRecordListContext);
  const { handleApiResponse } = useErrorHandling();

  const handleSubmit = async (formData) => {
    const data = {
      id: record.id,
      readPages: parseInt(formData.readPages, 10),
      readingTime: formData.readingTime,
      date: formData.formattedDate,
      ...(formData.note && { note: formData.note }),
    };

    await handleApiResponse(handlerMap.handleUpdate(data), {
      successMessage: "reading_record_updated",
      successCallback: async () => {
        onHide();
        await handlerMap.handleListByBookId({ bookId });
      },
    });
  };

  return (
    <ReadingRecordModal
      show={show}
      onHide={onHide}
      onSubmit={handleSubmit}
      title={t("reading_records.edit")}
      submitText={t("common.save")}
      totalPages={totalPages}
      currentReadPages={currentReadPages}
      record={record}
    />
  );
};

export default ReadingRecordEditModal;
