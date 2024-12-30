import React, { useState } from "react";
import BookList from "../components/book/BookList";
import BookSearch from "../components/book/BookSearch";

const BookListPage = ({ books, onToggleFinished }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  const unfinishedBooks = filteredBooks.filter((book) => !book.finished);
  const finishedBooks = filteredBooks.filter((book) => book.finished);

  return (
    <>
      <BookSearch onSearch={setSearchQuery} />
      <BookList
        type="unfinished"
        books={unfinishedBooks}
        onToggleFinished={onToggleFinished}
      />
      <BookList
        type="finished"
        books={finishedBooks}
        onToggleFinished={onToggleFinished}
      />
    </>
  );
};

export default BookListPage;
