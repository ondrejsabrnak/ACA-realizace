import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useToast } from "../providers/ToastProvider";
import { BookListContext } from "../providers/BookListProvider";
import {
  BookDetailPending,
  BookDetailError,
  BookDetailSuccess,
} from "../components/book/detail/states";

const BookDetailPage = () => {
  const { id } = useParams();
  const { showError } = useToast();
  const { handlerMap } = useContext(BookListContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await handlerMap.handleGet({ id });
        if (result.ok) {
          setBook(result.data);
        } else {
          setError(result.error);
          showError(result.error.code, result.error.message);
        }
      } catch (error) {
        setError({ code: "unexpectedError", message: error.message });
        showError("unexpectedError", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, handlerMap, showError]);

  return (
    <>
      <Row>
        <Col>
          {loading ? (
            <BookDetailPending />
          ) : error ? (
            <BookDetailError error={error} />
          ) : (
            <BookDetailSuccess book={book} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default BookDetailPage;
