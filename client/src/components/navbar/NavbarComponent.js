import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "./NavbarBrand";
import AddBookButton from "./AddBookButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { BookListContext } from "../../providers/BookListProvider";

const NavbarComponent = () => {
  const { handlerMap } = useContext(BookListContext);

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <NavbarBrand />
        <div className="d-flex align-items-center gap-3">
          <AddBookButton onAddBook={handlerMap.handleCreate} />
          <LanguageSwitcher />
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
