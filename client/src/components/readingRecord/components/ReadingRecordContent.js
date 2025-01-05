import React, { useContext, useEffect } from "react";
import {
  ReadingRecordPending,
  ReadingRecordError,
  ReadingRecordSuccess,
  ReadingRecordEmptyList,
} from "..";
import { ReadingRecordListContext } from "../../../providers/ReadingRecordListProvider";

const ReadingRecordContent = ({ bookId, totalPages, renderHeader }) => {
  const { state, data, error, currentBookId, handlerMap } = useContext(
    ReadingRecordListContext
  );

  useEffect(() => {
    // Načteme data pouze pokud se změnil bookId
    if (bookId && bookId !== currentBookId) {
      handlerMap.handleListByBookId({ bookId });
    }
  }, [bookId, currentBookId, handlerMap]);

  const currentReadPages =
    data?.data?.items?.reduce((sum, record) => sum + record.readPages, 0) || 0;

  const renderContent = () => {
    if (state === "pending") return <ReadingRecordPending />;
    if (state === "error") return <ReadingRecordError error={error} />;
    if (!data?.data?.items?.length) return <ReadingRecordEmptyList />;

    return (
      <ReadingRecordSuccess
        data={data?.data}
        bookId={bookId}
        totalPages={totalPages}
        currentReadPages={currentReadPages}
      />
    );
  };

  return (
    <>
      {renderHeader(currentReadPages)}
      {renderContent()}
    </>
  );
};

export default ReadingRecordContent;
