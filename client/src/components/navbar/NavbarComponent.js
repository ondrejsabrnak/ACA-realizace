import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { BookAddButton } from "../book";
import { BookListContext } from "../../providers/BookListProvider";

const NavbarComponent = () => {
  const { handlerMap } = useContext(BookListContext);

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>ACA</Navbar.Brand>
        <BookAddButton onAddBook={handlerMap.handleCreate} />
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
