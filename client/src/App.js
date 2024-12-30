import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import BookListPage from "./pages/BookListPage";
import NavbarComponent from "./components/navbar/Navbar";
import { books as initialBooks } from "./data/mockBooks";

const App = () => {
  const [books, setBooks] = useState(initialBooks);

  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const toggleBookFinished = (bookId, data) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId
          ? {
              ...book,
              ...data,
              finished: !book.finished,
              pagesRead: !book.finished ? book.numberOfPages : book.pagesRead,
            }
          : book
      )
    );
  };

  return (
    <BrowserRouter>
      <NavbarComponent onAddBook={handleAddBook} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <BookListPage
                books={books}
                onToggleFinished={toggleBookFinished}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
