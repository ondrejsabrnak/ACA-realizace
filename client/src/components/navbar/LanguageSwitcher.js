import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";
import { languages } from "../../config/languages";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Get base language code without region (e.g., "en" from "en-GB")
  const currentLanguage = i18n.language.split("-")[0];

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" size="sm">
        {currentLanguage.toUpperCase()}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end">
        {languages.map(({ code, name }) => (
          <Dropdown.Item
            key={code}
            onClick={() => changeLanguage(code)}
            active={currentLanguage === code}
            className="d-flex justify-content-between align-items-center px-3"
          >
            {name} <span className="text-muted">{code.toUpperCase()}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
