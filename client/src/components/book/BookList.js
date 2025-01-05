import React from "react";
import { BookListCard } from ".";
import Row from "react-bootstrap/Row";

const BookList = ({ books, type }) => {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {books.map((book) => (
        <BookListCard key={book.id} book={book} />
      ))}
    </Row>
  );
};

export default BookList;
