import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { ReadingRecordListContext } from "../../providers/ReadingRecordListProvider";
import AddReadingRecordModal from "./AddReadingRecordModal";

const BookReadingRecords = ({ bookId, totalPages = 0 }) => {
  const { t } = useTranslation();
  const { state, data, error, currentBookId, handlerMap } = useContext(
    ReadingRecordListContext
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const currentReadPages = React.useMemo(() => {
    if (!data?.data?.items) return 0;
    return data.data.items.reduce((sum, record) => sum + record.readPages, 0);
  }, [data?.data?.items]);

  useEffect(() => {
    // Only fetch if we have a bookId and it's different from the current one
    if (bookId && bookId !== currentBookId) {
      handlerMap.handleListByBookId({ bookId });
    }
  }, [bookId, currentBookId, handlerMap]);

  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  const handleAddConfirm = async (formData) => {
    const result = await handlerMap.handleCreate({
      bookId,
      ...formData,
    });

    if (result.ok) {
      setShowAddModal(false);
    } else {
      // Error is handled by the provider
    }
  };

  const handleEditRecord = (record) => {
    // TODO: Implement editing reading record
  };

  const handleDeleteRecord = (record) => {
    // TODO: Implement deleting reading record
  };

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
            <th>{t("books.read_pages")}</th>
            <th>{t("books.reading_time")}</th>
            <th className="text-end w-1">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {data.data.items.map((record) => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{record.readPages}</td>
              <td>{record.readingTime}</td>
              <td className="text-end">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleEditRecord(record)}
                  className="p-0 me-2"
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleDeleteRecord(record)}
                  className="p-0 text-danger"
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <Card className="mt-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">
              {t("books.reading_records")}
            </Card.Title>
            <Button variant="primary" size="sm" onClick={handleAddRecord}>
              <i className="bi bi-plus-lg me-1"></i>
              {t("books.add_reading_record")}
            </Button>
          </div>
          {renderContent()}
        </Card.Body>
      </Card>

      <AddReadingRecordModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onConfirm={handleAddConfirm}
        totalPages={parseInt(totalPages, 10) || 0}
        currentReadPages={currentReadPages}
      />
    </>
  );
};

export default BookReadingRecords;
