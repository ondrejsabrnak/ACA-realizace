import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useTranslation } from "react-i18next";

const BookCard = ({ book }) => {
  const { t } = useTranslation();

  return (
    <Col>
      <Card className={book.finished ? "bg-light" : ""}>
        <Card.Body>
          <Card.Subtitle className="mb-1 text-muted">
            {book.author}
          </Card.Subtitle>
          <Card.Title className="mb-3">{book.title}</Card.Title>
          <Card.Text className="mb-2">
            <small className="text-muted">
              {book.pagesRead}/{book.numberOfPages} {t("books.pages_read")}
            </small>
          </Card.Text>
          <div className="mb-2">
            <ProgressBar now={(book.pagesRead / book.numberOfPages) * 100} />
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default BookCard;
