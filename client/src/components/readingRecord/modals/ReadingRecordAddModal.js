import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReadingRecordModal } from "..";
import { ReadingRecordListContext } from "../../../providers/ReadingRecordListProvider";
import { useErrorHandling } from "../../../hooks/useErrorHandling";

const ReadingRecordAddModal = ({
  show,
  onHide,
  bookId,
  totalPages,
  currentReadPages,
}) => {
  const { t } = useTranslation();
  const { handlerMap } = useContext(ReadingRecordListContext);
  const { handleApiResponse } = useErrorHandling();

  const handleSubmit = async (formData) => {
    await handleApiResponse(handlerMap.handleCreate({ bookId, ...formData }), {
      successMessage: "reading_record_created",
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
      title={t("reading_records.add")}
      submitText={t("common.add")}
      totalPages={totalPages}
      currentReadPages={currentReadPages}
    />
  );
};

export default ReadingRecordAddModal;
