import React from "react";
import { BrowserRouter } from "react-router-dom";
import ToastProvider from "./providers/ToastProvider";
import BookListProvider from "./providers/BookListProvider";
import AppRouter from "./Router";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <BookListProvider>
          <AppRouter />
        </BookListProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
