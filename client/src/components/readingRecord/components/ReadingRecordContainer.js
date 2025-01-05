import React from "react";
import Card from "react-bootstrap/Card";
import { ReadingRecordHeader, ReadingRecordContent } from "..";

const ReadingRecordContainer = ({ bookId, totalPages = 0 }) => {
  return (
    <Card className="mt-3">
      <Card.Body>
        <ReadingRecordHeader bookId={bookId} totalPages={totalPages} />
        <ReadingRecordContent bookId={bookId} totalPages={totalPages} />
      </Card.Body>
    </Card>
  );
};

export default ReadingRecordContainer;
