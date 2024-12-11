import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import NavbarComponent from "./components/navbar/navbar";

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
  </div>
);

export default App;
