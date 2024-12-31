import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NavbarBrand = () => {
  const { t } = useTranslation();

  return (
    <Navbar.Brand as={Link} to="/">
      {t("app_name")}
    </Navbar.Brand>
  );
};

export default NavbarBrand;
