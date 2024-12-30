import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "./NavbarBrand";
import AddBookButton from "./AddBookButton";
import LanguageSwitcher from "./LanguageSwitcher";

const NavbarComponent = ({ setBooks }) => {
  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <NavbarBrand />
        <div className="d-flex align-items-center gap-3">
          <AddBookButton onAddBook={handleAddBook} />
          <LanguageSwitcher />
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
