import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import NavbarComponent from "./components/navbar/navbar";
import FooterComponent from "./components/footer/footer";

// Just for testing before joining the backend
const books = [
  {
    title: "Harry Potter a Kámen mudrců",
    author: "J. K. Rowling",
    numberOfPages: 288,
    isbn: "978-80-00-06758-2",
    id: "539c7ccca3b25df23b2a33e7eb0da733",
    pagesRead: 75,
    finished: false,
  },
  {
    title: "Hobit aneb Cesta tam a zase zpátky",
    author: "J. R. R. Tolkien",
    numberOfPages: 310,
    isbn: "978-80-719-5377-2",
    id: "8c627b526a5945f089f8d342b3c11888",
    pagesRead: 310,
    finished: true,
  },
  {
    title: "Pán prstenů: Společenstvo prstenu",
    author: "J. R. R. Tolkien",
    numberOfPages: 423,
    isbn: "978-80-719-5378-9",
    id: "a7933f720ed04a1dbbf39b8c1323d511",
    pagesRead: 150,
    finished: false,
  },
];

const App = () => (
  <div className="min-vh-100 d-flex flex-column">
    <header>
      <NavbarComponent />
    </header>
    <main className="flex-grow-1">
      <Container className="p-3">
        <Container className="p-5 mb-4 bg-light rounded-3">
          <Button>Click Me!</Button>
        </Container>
      </Container>
    </main>
    <footer className="bg-body-tertiary py-3 mt-auto">
      <FooterComponent />
    </footer>
  </div>
);

export default App;
