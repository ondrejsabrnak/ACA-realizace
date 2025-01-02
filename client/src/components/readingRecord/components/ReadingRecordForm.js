import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const ReadingRecordForm = ({
  formId,
  validated,
  readPagesError,
  defaultValues = {},
  onReadPagesChange,
}) => {
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(defaultValues.date || "");

  return (
    <Form id={formId} noValidate validated={validated}>
      <Form.Group className="mb-3">
        <Form.Label>
          {t("reading_records.read_pages")}{" "}
          <span className="text-danger">*</span>
        </Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            type="number"
            name="readPages"
            min="1"
            required
            defaultValue={defaultValues.readPages}
            onChange={onReadPagesChange}
            isInvalid={!!readPagesError}
          />
          <Form.Control.Feedback type="invalid">
            {readPagesError || t("reading_records.read_pages_required")}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          {t("reading_records.reading_time")}{" "}
          <span className="text-danger">*</span>
        </Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            type="text"
            name="readingTime"
            pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
            placeholder="00:30"
            required
            defaultValue={defaultValues.readingTime}
          />
          <Form.Control.Feedback type="invalid">
            {t("reading_records.reading_time_required")}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          {t("reading_records.date")} <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="date"
          name="date"
          required
          max={today}
          defaultValue={defaultValues.date}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {selectedDate && new Date(selectedDate) > new Date(today)
            ? t("reading_records.date_future")
            : t("reading_records.date_required")}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{t("reading_records.note")}</Form.Label>
        <Form.Control
          as="textarea"
          name="note"
          rows={3}
          defaultValue={defaultValues.note}
        />
      </Form.Group>
    </Form>
  );
};

export default ReadingRecordForm;
