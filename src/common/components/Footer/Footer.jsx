import React from "react";
import "./Footer.css";
import logo from "../../../assets/saayam-logo-footer-transparent.png";

export default function Footer() {
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
              <a href="#">Home</a>
              <a href="#">About Us</a>
              <a href="#">Mission &amp; Vision</a>
              <a href="#">Our Team</a>
              <a href="#">What We Offer</a>
              <a href="#">Donate</a>
            </nav>

            <div className="footer-contact">
              <button type="button">Contact Us</button>
            </div>
          </div>
          {/* Divider exactly under that row */}
          <hr className="footer-divider" />
        </div>
        {/* /.footer-top-wrapper */}

        {/* 2) Bottom grid: copyright + links */}
        <div className="footer-bottom-grid">
          <div className="footer-copy">
            © 2025 Saayam For All. All rights reserved.
          </div>
          <div className="footer-link-cell">
            <a href="#">Site Map</a>
          </div>
          <div className="footer-link-cell">
            <a href="#">Terms and Conditions</a>
          </div>
          <div className="footer-link-cell">
            <a href="#">Privacy Policy</a>
          </div>
        </div>
        {/* /.footer-bottom-grid */}

      </div>
      {/* /.footer-inner */}
    </footer>
  );
}
