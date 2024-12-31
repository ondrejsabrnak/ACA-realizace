import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { ReadingRecordListContext } from "../../providers/ReadingRecordListProvider";

const BookReadingRecords = ({ bookId }) => {
  const { t } = useTranslation();
  const { state, data, error, currentBookId, handlerMap } = useContext(
    ReadingRecordListContext
  );

  useEffect(() => {
    // Only fetch if we have a bookId and it's different from the current one
    if (bookId && bookId !== currentBookId) {
      handlerMap.handleListByBookId({ bookId });
    }
  }, [bookId, currentBookId, handlerMap]);

  const renderContent = () => {
    if (state === "pending") {
      return (
        <div className="text-center p-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">{t("common.loading")}</span>
          </Spinner>
        </div>
      );
    }

    if (state === "error") {
      return (
        <Alert variant="danger">
          {t(`errors.${error.code}`, { defaultValue: error.message })}
        </Alert>
      );
    }

    if (!data?.data?.items?.length) {
      return <Alert variant="info">{t("books.no_reading_records")}</Alert>;
    }

    return (
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>{t("books.date")}</th>
            <th>{t("books.pages_read")}</th>
            <th>{t("books.reading_time")}</th>
          </tr>
        </thead>
        <tbody>
          {data.data.items.map((record) => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{record.readPages}</td>
              <td>{record.readingTime}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>{t("books.reading_records")}</Card.Title>
        {renderContent()}
      </Card.Body>
    </Card>
  );
};

export default BookReadingRecords;
