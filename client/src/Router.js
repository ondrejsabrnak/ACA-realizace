import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import BookListPage from "./pages/BookListPage";
import BookDetailPage from "./pages/BookDetailPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<BookListPage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
