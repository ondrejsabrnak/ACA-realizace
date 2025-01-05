import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { BookAddButton } from "../book";
import { BookListContext } from "../../providers/BookListProvider";
import NavbarBrand from "./NavbarBrand";

const NavbarComponent = () => {
  const { handlerMap } = useContext(BookListContext);

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <NavbarBrand />
        <BookAddButton onAddBook={handlerMap.handleCreate} />
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
