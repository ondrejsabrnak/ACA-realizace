import React from "react";
import Container from "react-bootstrap/Container";
import NavbarComponent from "./components/navbar/navbar";
import FooterComponent from "./components/footer/footer";
import BookList from "./components/book/BookList";
import { books } from "./data/mockBooks";

const App = () => {
  const unfinishedBooks = books.filter((book) => !book.finished);
  const finishedBooks = books.filter((book) => book.finished);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <header>
        <NavbarComponent />
      </header>
      <main className="flex-grow-1">
        <Container className="py-4">
          <BookList type="unfinished" books={unfinishedBooks} />
          <BookList type="finished" books={finishedBooks} />
        </Container>
      </main>
      <footer className="bg-body-tertiary py-3 mt-auto">
        <FooterComponent />
      </footer>
    </div>
  );
};

export default App;
