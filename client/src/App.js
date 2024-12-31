import React from "react";
import { BrowserRouter } from "react-router-dom";
import Container from "react-bootstrap/Container";
import ErrorProvider from "./providers/ErrorProvider";
import ToastProvider from "./providers/ToastProvider";
import BookListProvider from "./providers/BookListProvider";
import AppRouter from "./Router";

function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <ToastProvider>
          <BookListProvider>
            <AppRouter />
          </BookListProvider>
        </ToastProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
}

export default App;
