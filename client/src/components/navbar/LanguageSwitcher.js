import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" size="sm">
        {i18n.language.toUpperCase()}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end">
        <Dropdown.Item
          onClick={() => changeLanguage("en")}
          active={i18n.language === "en"}
          className="d-flex justify-content-between align-items-center px-3"
        >
          English <span className="text-muted">EN</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => changeLanguage("cs")}
          active={i18n.language === "cs"}
          className="d-flex justify-content-between align-items-center px-3"
        >
          Čeština <span className="text-muted">CS</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
