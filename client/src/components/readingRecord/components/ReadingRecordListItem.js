import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { ReadingRecordDeleteModal, ReadingRecordEditModal } from "..";

const ReadingRecordListItem = ({ record, totalPages, currentReadPages }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${day}.${month}.${year}`;
  };

  return (
    <>
      <tr>
        <td>{formatDate(record.date)}</td>
        <td>{record.readPages}</td>
        <td>{record.readingTime}</td>
        <td>
          {record.note ? (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${record.id}`}>{record.note}</Tooltip>
              }
            >
              <span
                className="text-muted text-truncate d-inline-block"
                style={{ maxWidth: "200px" }}
              >
                {record.note}
              </span>
            </OverlayTrigger>
          ) : (
            <span className="text-muted">-</span>
          )}
        </td>
        <td className="text-end">
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="p-0 me-2"
          >
            <i className="bi bi-pencil"></i>
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="p-0 text-danger"
          >
            <i className="bi bi-trash"></i>
          </Button>
        </td>
      </tr>

      <ReadingRecordEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        totalPages={parseInt(totalPages, 10) || 0}
        currentReadPages={currentReadPages}
        record={record}
        bookId={record.bookId}
      />

      <ReadingRecordDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        record={record}
        bookId={record.bookId}
      />
    </>
  );
};

export default ReadingRecordListItem;
