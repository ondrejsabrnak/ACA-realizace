import React, { useContext, useEffect } from "react";
import {
  ReadingRecordPending,
  ReadingRecordError,
  ReadingRecordSuccess,
} from "..";
import { ReadingRecordListContext } from "../../../providers/ReadingRecordListProvider";

const ReadingRecordContent = ({ bookId, totalPages }) => {
  const { state, data, error, currentBookId, handlerMap } = useContext(
    ReadingRecordListContext
  );

  useEffect(() => {
    if (bookId && bookId !== currentBookId) {
      handlerMap.handleListByBookId({ bookId });
    }
  }, [bookId, currentBookId, handlerMap]);

  if (state === "pending") {
    return <ReadingRecordPending />;
  }

  if (state === "error") {
    return <ReadingRecordError error={error} />;
  }

  return (
    <ReadingRecordSuccess
      data={data?.data}
      bookId={bookId}
      totalPages={totalPages}
    />
  );
};

export default ReadingRecordContent;
