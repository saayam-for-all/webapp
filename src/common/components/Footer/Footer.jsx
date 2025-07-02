import { useTranslation } from "react-i18next";
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
              <a href="/">{t("HOME")}</a>
              <a href="/our-mission">{t("Our Mission")}</a>
              <a href="/our-team">{t("OUR_TEAM")}</a>
              <a href="/how-we-operate">{t("How We Operate")}</a>
              <a href="/contact">{t("CONTACT")}</a>
            </nav>

            <div className="footer-contact">
              <a href="/donate">
                <button type="button">{t("DONATE")}</button>
              </a>
            </div>
          </div>
          {/* Divider exactly under that row */}
          <hr className="footer-divider" />
        </div>
        {/* /.footer-top-wrapper */}

        {/* 2) Bottom grid: copyright + links */}
        <div className="footer-bottom-grid">
          <div className="footer-copy">
            {t("Copyright © 2025 Saayam For All. All rights reserved.")}
          </div>
          <div className="footer-links">
            <a href="/sitemap">{t("SITE_MAP")}</a>
            <a href="#">{t("TERMS_AND_CONDITIONS")}</a>
            <a href="#">{t("PRIVACY_POLICY")}</a>
          </div>
        </div>
        {/* /.footer-bottom-grid */}
      </div>
      {/* /.footer-inner */}
    </footer>
  );
}
