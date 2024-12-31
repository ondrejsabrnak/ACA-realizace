import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import BookListPage from "./pages/BookListPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<BookListPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
