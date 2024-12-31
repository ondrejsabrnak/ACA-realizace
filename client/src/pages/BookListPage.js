import React, { useState, useContext } from "react";
import BookList from "../components/book/BookList";
import BookSearch from "../components/book/BookSearch";
import { BookListContext } from "../providers/BookListProvider";
import { useToast } from "../providers/ToastProvider";

const BookListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, error, state, handlerMap } = useContext(BookListContext);
  const { showError } = useToast();

  // Default error handling for non-connection errors
  if (
    state === "error" &&
    error &&
    error.code !== "Failed to fetch" &&
    !error.message?.includes("net::ERR_CONNECTION_REFUSED")
  ) {
    showError(error.code, error.message);
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
            showError(result.error.code, result.error.message);
          }
        }}
      />
      <BookList
        type="finished"
        books={finishedBooks}
        onToggleFinished={async (book) => {
          const result = await handlerMap.handleUpdate(book);
          if (!result.ok && result.error) {
            showError(result.error.code, result.error.message);
          }
        }}
      />
    </>
  );
};

export default BookListPage;
