import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import { BookFinishedModal, BookUnfinishedModal } from "..";

const BookStatusToggle = ({ book, compact = false, size }) => {
  const { t } = useTranslation();
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [showUnfinishedModal, setShowUnfinishedModal] = useState(false);

  const handleStatusToggle = () => {
    if (book.finished) {
      setShowUnfinishedModal(true);
    } else {
      setShowFinishedModal(true);
    }
  };

  const icon = (
    <i
      className={`bi ${book.finished ? "bi-check-circle-fill" : "bi-circle"}${
        compact ? " fs-5" : ""
      }`}
    />
  );

  const button = compact ? (
    <Button
      variant="link"
      className={`p-0 ${book.finished ? "text-success" : "text-muted"}`}
      onClick={handleStatusToggle}
      title={
        book.finished ? t("books.mark_unfinished") : t("books.mark_finished")
      }
    >
      {icon}
    </Button>
  ) : (
    <Button
      variant={book.finished ? "outline-success" : "outline-primary"}
      onClick={handleStatusToggle}
      className="d-flex align-items-center gap-2"
      size={size}
    >
      {icon}
      {book.finished ? t("books.mark_unfinished") : t("books.mark_finished")}
    </Button>
  );

  return (
    <>
      {button}

      <BookFinishedModal
        show={showFinishedModal}
        onHide={() => setShowFinishedModal(false)}
        book={book}
      />

      <BookUnfinishedModal
        show={showUnfinishedModal}
        onHide={() => setShowUnfinishedModal(false)}
        book={book}
      />
    </>
  );
};

export default BookStatusToggle;
