import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.svg";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* 1) Wrap top row + divider */}
        <div className="footer-top-wrapper">
          {/* Top row: logo | nav | contact */}
          <div className="footer-top">
            <div className="footer-logo">
              <img src={logo} alt="Saayam logo" />
            </div>

            <nav className="footer-nav" aria-label="Footer navigation">
              <Link to="/">{t("HOME")}</Link>
              <Link to="/our-mission">{t("OUR_MISSION")}</Link>
              <Link to="/our-team">{t("OUR_TEAM")}</Link>
              <Link to="/how-we-operate">{t("HOW_WE_OPERATE")}</Link>
              <Link to="/contact">{t("CONTACT")}</Link>
            </nav>

            <div className="footer-contact">
              <Link to="/donate">
                <button type="button">{t("DONATE")}</button>
              </Link>
            </div>
          </div>
          {/* Divider exactly under that row */}
          <hr className="footer-divider" />
        </div>
        {/* /.footer-top-wrapper */}

        {/* 2) Bottom grid: copyright + links */}
        <div className="footer-bottom-grid">
          <div className="footer-copy">{t("COPYRIGHT")}</div>
          <div className="footer-links">
            <Link to="/sitemap">{t("SITE_MAP")}</Link>

            <Link to="/terms-and-conditions">{t("TERMS_AND_CONDITIONS")}</Link>
            <Link to="/privacy-policy">{t("PRIVACY_POLICY")}</Link>
          </div>
        </div>
        {/* /.footer-bottom-grid */}
      </div>
      {/* /.footer-inner */}
    </footer>
  );
}
