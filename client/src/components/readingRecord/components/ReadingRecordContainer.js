import React from "react";
import Card from "react-bootstrap/Card";
import { ReadingRecordHeader, ReadingRecordContent } from "..";

const ReadingRecordContainer = ({ bookId, totalPages = 0 }) => {
  return (
    <Card className="mt-3">
      <Card.Body>
        <ReadingRecordContent
          bookId={bookId}
          totalPages={totalPages}
          renderHeader={(currentReadPages) => (
            <ReadingRecordHeader
              bookId={bookId}
              totalPages={totalPages}
              currentReadPages={currentReadPages}
            />
          )}
        />
      </Card.Body>
    </Card>
  );
};

export default ReadingRecordContainer;
