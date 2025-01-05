import React from "react";
import { ReadingRecordContainer } from "../../readingRecord";
import ReadingRecordListProvider from "../../../providers/ReadingRecordListProvider";

const BookDetailRecords = ({ bookId, totalPages = 0, onRecordChange }) => {
  return (
    <ReadingRecordListProvider>
      <ReadingRecordContainer
        bookId={bookId}
        totalPages={totalPages}
        onRecordChange={onRecordChange}
      />
    </ReadingRecordListProvider>
  );
};

export default BookDetailRecords;
