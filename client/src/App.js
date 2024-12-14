import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import NavbarComponent from "./components/navbar/Navbar";
import FooterComponent from "./components/footer/Footer";
import BookList from "./components/book/BookList";
import BookSearch from "./components/book/BookSearch";
import { books as initialBooks } from "./data/mockBooks";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState(initialBooks);

  const toggleBookFinished = (bookId) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId
          ? { ...book, finished: !book.finished, pagesRead: !book.finished ? book.numberOfPages : book.pagesRead }
          : book
      )
    );
  };

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
    <div className="min-vh-100 d-flex flex-column">
      <header>
        <NavbarComponent />
      </header>
      <main className="flex-grow-1">
        <Container className="py-4">
          <BookSearch onSearch={setSearchQuery} />
          <BookList
            type="unfinished"
            books={unfinishedBooks}
            onToggleFinished={toggleBookFinished}
          />
          <BookList
            type="finished"
            books={finishedBooks}
            onToggleFinished={toggleBookFinished}
          />
        </Container>
      </main>
      <footer className="bg-body-tertiary py-3 mt-auto">
        <FooterComponent />
      </footer>
    </div>
  );
};

export default App;
