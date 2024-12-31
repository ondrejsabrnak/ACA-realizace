import React from "react";
import ReadingRecordContainer from "../readingRecord/ReadingRecordContainer";

const BookReadingRecords = ({ bookId, totalPages = 0, onRecordChange }) => {
  return (
    <ReadingRecordContainer
      bookId={bookId}
      totalPages={totalPages}
      onRecordChange={onRecordChange}
    />
  );
};

export default BookReadingRecords;
