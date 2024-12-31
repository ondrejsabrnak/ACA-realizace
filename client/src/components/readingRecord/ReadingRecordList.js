import React from "react";
import { useTranslation } from "react-i18next";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const ReadingRecordList = ({ records, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>{t("reading_records.date")}</th>
          <th>{t("reading_records.read_pages")}</th>
          <th>{t("reading_records.reading_time")}</th>
          <th>{t("reading_records.note")}</th>
          <th className="text-end w-1">{t("common.actions")}</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td>{record.date}</td>
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
                onClick={() => onEdit(record)}
                className="p-0 me-2"
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => onDelete(record)}
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

export default ReadingRecordList;
