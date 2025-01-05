import React from "react";
import {
  ReadingRecordPending,
  ReadingRecordError,
  ReadingRecordSuccess,
} from "..";

const ReadingRecordContent = ({ state, error, data, onEdit, onDelete }) => {
  const contentMap = {
    pending: () => <ReadingRecordPending />,
    error: () => <ReadingRecordError error={error} />,
    success: () => (
      <ReadingRecordSuccess data={data} onEdit={onEdit} onDelete={onDelete} />
    ),
  };

  const renderContent = contentMap[state] || contentMap.success;
  return renderContent();
};

export default ReadingRecordContent;
