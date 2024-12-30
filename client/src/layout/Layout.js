import React from "react";
import Container from "react-bootstrap/Container";
import NavbarComponent from "../components/navbar/Navbar";
import FooterComponent from "../components/footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = ({ setBooks }) => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <header>
        <NavbarComponent setBooks={setBooks} />
      </header>
      <main className="flex-grow-1">
        <Container className="py-4">
          <Outlet />
        </Container>
      </main>
      <footer className="bg-body-tertiary py-3 mt-auto">
        <FooterComponent />
      </footer>
    </div>
  );
};

export default Layout;
