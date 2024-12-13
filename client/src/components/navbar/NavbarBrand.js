import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { useTranslation } from "react-i18next";

const NavbarBrand = () => {
  const { t } = useTranslation();

  return <Navbar.Brand href="#home">{t("app_name")}</Navbar.Brand>;
};

export default NavbarBrand;
