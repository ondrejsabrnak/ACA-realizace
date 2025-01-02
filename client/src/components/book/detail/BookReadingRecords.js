import React from "react";
import ReadingRecordContainer from "../../readingRecord/ReadingRecordContainer";
import ReadingRecordListProvider from "../../../providers/ReadingRecordListProvider";

const BookReadingRecords = ({ bookId, totalPages = 0, onRecordChange }) => {
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

export default BookReadingRecords;
