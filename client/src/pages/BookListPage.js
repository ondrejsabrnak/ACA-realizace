import React, { useContext, useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useToast } from "../providers/ToastProvider";
import { BookListContext } from "../providers/BookListProvider";
import {
  BookListPending,
  BookListError,
  BookListSuccess,
} from "../components/book/list/states";

const BookListPage = () => {
  const { showError } = useToast();
  const { data } = useContext(BookListContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!data) {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (!data.ok && data.error) {
      setError(data.error);
      showError(data.error.code || "unexpectedError", data.error.message);
    } else {
      setError(null);
    }
  }, [data, showError]);

  const contentMap = {
    pending: () => <BookListPending />,
    error: () => <BookListError error={error} />,
    success: () => <BookListSuccess books={data?.data?.items || []} />,
  };

  const getState = () => {
    if (loading) return "pending";
    if (error) return "error";
    return "success";
  };

  const renderContent = contentMap[getState()];

  return (
    <Row>
      <Col>{renderContent()}</Col>
    </Row>
  );
};

export default BookListPage;
