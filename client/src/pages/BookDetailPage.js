import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BookListContext } from "../providers/BookListProvider";
import { useError } from "../providers/ErrorProvider";
import FetchHelper from "../helpers/FetchHelper";
import StarRating from "../components/book/StarRating";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showError } = useError();
  const [book, setBook] = useState(null);
  const [readingRecords, setReadingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookDetail = async () => {
      try {
        const result = await FetchHelper.book.get({ id });
        if (result.ok) {
          setBook(result.data.data);
          // TODO: Načíst záznamy o čtení
        } else {
          showError(result.data.error.code, result.data.error.message);
          navigate("/");
        }
      } catch (error) {
        showError("failedToLoad", "Failed to load book detail");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadBookDetail();
  }, [id, navigate, showError]);

  if (loading || !book) {
    return null; // TODO: Add loading spinner
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{book.title}</h1>
        <Button variant="outline-primary" onClick={() => navigate("/")}>
          {t("common.back")}
        </Button>
      </div>

      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{t("books.book_info")}</Card.Title>
              <dl className="row mb-0">
                <dt className="col-sm-3 d-flex align-items-center">
                  {t("books.author")}
                </dt>
                <dd className="col-sm-9">{book.author}</dd>

                <dt className="col-sm-3 d-flex align-items-center">
                  {t("books.number_of_pages")}
                </dt>
                <dd className="col-sm-9">
                  {book.pagesRead}/{book.numberOfPages} {t("books.pages_read")}
                </dd>

                <dt className="col-sm-3 d-flex align-items-center">
                  {t("books.isbn")}
                </dt>
                <dd className="col-sm-9">
                  {book.isbn || <span className="text-muted">Nezadáno</span>}
                </dd>

                <dt className="col-sm-3 d-flex align-items-center">
                  {t("books.status")}
                </dt>
                <dd className="col-sm-9">
                  {book.finished ? t("books.finished") : t("books.unfinished")}
                </dd>

                {book.finished && (
                  <>
                    <dt className="col-sm-3 d-flex align-items-center">
                      {t("books.rating")}
                    </dt>
                    <dd className="col-sm-9">
                      <StarRating rating={book.rating} readonly />
                    </dd>

                    {book.review && (
                      <>
                        <dt className="col-sm-3 d-flex align-items-center">
                          {t("books.review")}
                        </dt>
                        <dd className="col-sm-9">{book.review}</dd>
                      </>
                    )}
                  </>
                )}
              </dl>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>{t("books.reading_records")}</Card.Title>
              {/* TODO: Add reading records list */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookDetailPage;
