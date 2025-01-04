import React from "react";
import {
  ReadingRecordList,
  ReadingRecordLoading,
  ReadingRecordError,
  ReadingRecordEmptyList,
} from "..";

const ReadingRecordContent = ({ state, error, data, onEdit, onDelete }) => {
  const contentMap = {
    pending: () => <ReadingRecordLoading />,
    error: () => <ReadingRecordError error={error} />,
    success: () =>
      !data?.data?.items?.length ? (
        <ReadingRecordEmptyList />
      ) : (
        <ReadingRecordList
          records={data.data.items}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
  };

  const renderContent = contentMap[state] || contentMap.success;
  return renderContent();
};

export default ReadingRecordContent;
