import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useTranslation } from "react-i18next";

const BookSearch = ({ onSearch }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <Form>
        <InputGroup>
          <InputGroup.Text className="bg-white">
            <i className="bi bi-search text-muted"></i>
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder={t("books.search_placeholder")}
            aria-label={t("books.search_label")}
            onChange={(e) => onSearch(e.target.value)}
          />
        </InputGroup>
      </Form>
    </div>
  );
};

export default BookSearch;