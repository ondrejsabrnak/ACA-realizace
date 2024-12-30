import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useTranslation } from "react-i18next";
import MarkFinishedModal from "./MarkFinishedModal";
import MarkUnfinishedModal from "./MarkUnfinishedModal";

const BookCard = ({ book, onToggleFinished }) => {
  const { t } = useTranslation();
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [showUnfinishedModal, setShowUnfinishedModal] = useState(false);

  const handleStatusChange = (data) => {
    onToggleFinished(book.id, data);
    setShowFinishedModal(false);
    setShowUnfinishedModal(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi ${
          index < rating ? "bi-star-fill" : "bi-star"
        } text-warning`}
      ></i>
    ));
  };

  return (
    <>
      <Col>
        <Card className={book.finished ? "bg-light" : ""}>
          <Card.Body className="position-relative">
            <Button
              variant="link"
              className={`position-absolute end-0 top-0 p-2 ${
                book.finished ? "text-success" : "text-muted"
              }`}
              onClick={() =>
                book.finished
                  ? setShowUnfinishedModal(true)
                  : setShowFinishedModal(true)
              }
              title={
                book.finished
                  ? t("books.mark_unfinished")
                  : t("books.mark_finished")
              }
            >
              <i
                className={`bi ${
                  book.finished ? "bi-check-circle-fill" : "bi-circle"
                } fs-5`}
              ></i>
            </Button>
            <Card.Subtitle className="mb-1 text-muted">
              {book.author}
            </Card.Subtitle>
            <Card.Title className="mb-2">{book.title}</Card.Title>
            {book.finished && (
              <div className="mb-2">{renderStars(book.rating || 0)}</div>
            )}
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

      <MarkFinishedModal
        show={showFinishedModal}
        onHide={() => setShowFinishedModal(false)}
        onConfirm={handleStatusChange}
        book={book}
      />

      <MarkUnfinishedModal
        show={showUnfinishedModal}
        onHide={() => setShowUnfinishedModal(false)}
        onConfirm={handleStatusChange}
        book={book}
      />
    </>
  );
};

export default BookCard;
