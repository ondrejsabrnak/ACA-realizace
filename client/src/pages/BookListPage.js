import React, { useState, useContext } from "react";
import BookList from "../components/book/BookList";
import BookSearch from "../components/book/BookSearch";
import { BookListContext } from "../providers/BookListProvider";
import Alert from "react-bootstrap/Alert";

const BookListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, error, state, handlerMap } = useContext(BookListContext);

  if (state === "error" && error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>{error.code}</Alert.Heading>
        <p>{error.message}</p>
      </Alert>
    );
  }

  if (!data || !data.data) return null;

  const books = data.data.items || [];

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
        onToggleFinished={async (book) => {
          const result = await handlerMap.handleUpdate(book);
          if (!result.ok && result.error) {
            alert(`${result.error.code}: ${result.error.message}`);
          }
        }}
      />
      <BookList
        type="finished"
        books={finishedBooks}
        onToggleFinished={async (book) => {
          const result = await handlerMap.handleUpdate(book);
          if (!result.ok && result.error) {
            alert(`${result.error.code}: ${result.error.message}`);
          }
        }}
      />
    </>
  );
};

export default BookListPage;
