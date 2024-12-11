import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useTranslation } from 'react-i18next';

const NavbarComponent = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">{t('app_name')}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">{t('nav.home')}</Nav.Link>
            <Nav.Link href="#books">{t('nav.books')}</Nav.Link>
            <Nav.Link href="#about">{t('nav.about')}</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => changeLanguage('en')}>EN</Nav.Link>
            <Nav.Link onClick={() => changeLanguage('cs')}>CS</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
