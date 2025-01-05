import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { BookAddButton } from "../book";
import { BookListContext } from "../../providers/BookListProvider";
import NavbarBrand from "./NavbarBrand";
import LanguageSwitcher from "./LanguageSwitcher";

const NavbarComponent = () => {
  const { handlerMap } = useContext(BookListContext);

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <NavbarBrand />
        <div className="d-flex gap-2">
          <BookAddButton onAddBook={handlerMap.handleCreate} />
          <LanguageSwitcher />
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
