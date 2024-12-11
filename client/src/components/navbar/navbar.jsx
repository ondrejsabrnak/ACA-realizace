import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";

const NavbarComponent = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">{t("app_name")}</Navbar.Brand>
        <div className="d-flex align-items-center ms-auto ms-lg-0"></div>
        <Dropdown className="order-lg-last mx-3 mx-lg-0">
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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">{t("nav.home")}</Nav.Link>
            <Nav.Link href="#books">{t("nav.books")}</Nav.Link>
            <Nav.Link href="#about">{t("nav.about")}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
