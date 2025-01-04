import React from "react";
import { ReadingRecordList, ReadingRecordEmptyList } from "..";

const ReadingRecordSuccess = ({ data, onEdit, onDelete }) => {
  if (!data?.data?.items?.length) {
    return <ReadingRecordEmptyList />;
  }

  return (
    <ReadingRecordList
      records={data.data.items}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default ReadingRecordSuccess;
