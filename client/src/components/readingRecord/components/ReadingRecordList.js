import React from "react";
import { useTranslation } from "react-i18next";
import Table from "react-bootstrap/Table";
import { ReadingRecordListItem } from "..";

const ReadingRecordList = ({
  records,
  bookId,
  totalPages,
  currentReadPages,
}) => {
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
          <ReadingRecordListItem
            key={record.id}
            record={record}
            totalPages={totalPages}
            currentReadPages={currentReadPages}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default ReadingRecordList;
