import React from "react";
import { BrowserRouter } from "react-router-dom";
import BookListProvider from "./providers/BookListProvider";
import { ErrorProvider } from "./providers/ErrorProvider";
import Router from "./Router";

function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <BookListProvider>
          <Router />
        </BookListProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
}

export default App;
