import React from "react";
import { BrowserRouter } from "react-router-dom";
import ToastProvider from "./providers/ToastProvider";
import BookListProvider from "./providers/BookListProvider";
import ReadingRecordListProvider from "./providers/ReadingRecordListProvider";
import AppRouter from "./Router";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <BookListProvider>
          <ReadingRecordListProvider>
            <AppRouter />
          </ReadingRecordListProvider>
        </BookListProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
