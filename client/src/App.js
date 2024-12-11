import React from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import "./App.css";

const App = () => (
  <Container className="p-3">
    <Container className="p-5 mb-4 bg-light rounded-3">
      <Button>Click Me!</Button>
    </Container>
  </Container>
);

export default App;
