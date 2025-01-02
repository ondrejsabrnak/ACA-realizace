import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <div className="text-center">
        <p className="mb-0">{t("footer.copyright")}</p>
        <small className="text-muted">{t("footer.version")}</small>
      </div>
    </Container>
  );
};

export default Footer;
