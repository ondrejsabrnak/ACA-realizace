import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./css/ReadingRecordForm.css";

const ReadingRecordForm = ({
  validated,
  readPagesError,
  defaultValues = {},
  onReadPagesChange,
  totalPages,
  currentReadPages,
}) => {
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [dateError, setDateError] = useState("");
  const maxPagesToRead = totalPages - currentReadPages;

  useEffect(() => {
    if (defaultValues.date) {
      const [day, month, year] = defaultValues.date.split("/");
      setSelectedDate(`${year}-${month}-${day}`);
      setDisplayDate(`${day}.${month}.${year}`);
    }
  }, [defaultValues.date]);

  const formatDateForApi = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  const validateDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  };

  // Validate initial value
  useEffect(() => {
    if (defaultValues.readPages) {
      onReadPagesChange({ target: { value: defaultValues.readPages } });
    }
  }, [defaultValues.readPages, onReadPagesChange]);

  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);

    if (!validateDate(value)) {
      setDateError(t("reading_records.date_future"));
      setDisplayDate("");
    } else {
      setDateError("");
      setDisplayDate(formatDateForDisplay(value));
      const formattedDate = formatDateForApi(value);
      const hiddenInput = document.getElementById("formattedDate");
      if (hiddenInput) {
        hiddenInput.value = formattedDate;
      }
    }
  };

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>
          {t("reading_records.read_pages")}{" "}
          <span className="text-danger">*</span>
          <span className="text-muted ms-1">
            ({t("reading_records.max_pages", { max: maxPagesToRead })})
          </span>
        </Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            type="number"
            name="readPages"
            min="1"
            max={maxPagesToRead}
            required
            defaultValue={defaultValues.readPages}
            onChange={onReadPagesChange}
            onInput={(e) => {
              if (e.target.value > maxPagesToRead) {
                e.target.value = maxPagesToRead;
                onReadPagesChange(e);
              }
            }}
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
        <InputGroup hasValidation>
          <Form.Control
            type="date"
            name="date"
            required
            max={today}
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
            isInvalid={!!dateError}
          />
          <Form.Control.Feedback type="invalid">
            {dateError || t("reading_records.date_required")}
          </Form.Control.Feedback>
        </InputGroup>
        <Form.Control
          type="text"
          className="date-display"
          value={displayDate}
          readOnly
          plaintext
        />
        <Form.Control
          type="hidden"
          id="formattedDate"
          name="formattedDate"
          value={formatDateForApi(selectedDate)}
        />
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
    </>
  );
};

export default ReadingRecordForm;
