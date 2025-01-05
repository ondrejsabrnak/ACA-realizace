import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useTranslation } from "react-i18next";
import {
  BookProgressBar,
  BookStatusToggle,
  BookFinishedModal,
  BookUnfinishedModal,
} from "..";
import "../css/list/BookListCard.css";

const BookListCard = ({ book, onToggleFinished }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [showUnfinishedModal, setShowUnfinishedModal] = useState(false);

  const handleStatusChange = async (updatedBook) => {
    const result = await onToggleFinished(updatedBook);
    return result;
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
        <Card
          className={`${book.finished ? "bg-light" : ""} hover-pointer`}
          style={{ height: "100%" }}
          onClick={() => navigate(`/book/${book.id}`)}
        >
          <Card.Body className="position-relative">
            <div
              className="position-absolute end-0 top-0 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <BookStatusToggle
                finished={book.finished}
                onStatusChange={() =>
                  book.finished
                    ? setShowUnfinishedModal(true)
                    : setShowFinishedModal(true)
                }
                compact={true}
              />
            </div>
            <div style={{ paddingRight: "40px" }}>
              <Card.Subtitle
                className="mb-1 text-muted"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {book.author}
              </Card.Subtitle>
              <Card.Title
                className="mb-2"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {book.title}
              </Card.Title>
            </div>
            {book.finished && (
              <div className="mb-2">{renderStars(book.rating || 0)}</div>
            )}
            <Card.Text className="mb-2">
              <small className="text-muted">
                {book.pagesRead}/{book.numberOfPages} {t("books.pages_read")}
              </small>
            </Card.Text>
            <div className="mb-2">
              <BookProgressBar
                pagesRead={book.pagesRead}
                numberOfPages={book.numberOfPages}
                showLabel={false}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>

      <BookFinishedModal
        show={showFinishedModal}
        onHide={() => setShowFinishedModal(false)}
        onConfirm={handleStatusChange}
        book={book}
      />

      <BookUnfinishedModal
        show={showUnfinishedModal}
        onHide={() => setShowUnfinishedModal(false)}
        onConfirm={handleStatusChange}
        book={book}
      />
    </>
  );
};

export default BookListCard;
