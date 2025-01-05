import React from "react";
import { useTranslation } from "react-i18next";
import { BookAddButton } from "..";

const BookEmptyList = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-5">
      <h3 className="h5 mb-3">{t("books.empty_list")}</h3>
      <p className="text-muted mb-4">{t("books.empty_list_description")}</p>
      <BookAddButton />
    </div>
  );
};

export default BookEmptyList;
