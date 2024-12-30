import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import BookListPage from "./pages/BookListPage";
import BookListProvider from "./providers/BookListProvider";

const App = () => {
  return (
    <BookListProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BookListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BookListProvider>
  );
};

export default App;
