import React from "react";
import { ReadingRecordList, ReadingRecordEmptyList } from "..";

const ReadingRecordSuccess = ({ data, bookId, totalPages }) => {
  const currentReadPages =
    data?.items?.reduce((sum, record) => sum + record.readPages, 0) || 0;

  if (!data?.items?.length) {
    return <ReadingRecordEmptyList />;
  }

  return (
    <ReadingRecordList
      records={data.items}
      bookId={bookId}
      totalPages={totalPages}
      currentReadPages={currentReadPages}
    />
  );
};

export default ReadingRecordSuccess;
