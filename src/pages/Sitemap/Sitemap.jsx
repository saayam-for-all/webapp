import React from "react";
import "./Sitemap.css";

const Sitemap = () => {
  return (
    <div className="sitemap-container">
      <div className="sitemap-inner">
        <h1 className="sitemap-title">Sitemap</h1>
        <div className="sitemap-content-wrapper">
          {/* Row 1: Home */}
          <div className="sitemap-row">
            <div className="sitemap-heading-with-items">
              <div className="sitemap-section">
                <h2 className="sitemap-heading">Home</h2>
                <ul>
                  <li>Saayam for all Home</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Row 2: About Us & Volunteer Services */}
          <div className="sitemap-row">
            <div className="sitemap-heading-with-items">
              <div className="sitemap-section">
                <h2 className="sitemap-heading">About Us</h2>
                <ul>
                  <li>Our Mission</li>
                  <li>Our Team</li>
                </ul>
              </div>
            </div>
            <div className="sitemap-section">
              <div className="sitemap-heading-with-items">
                <h2 className="sitemap-heading">Volunteer Services</h2>
                <ul>
                  <li>How We Operate</li>
                  <li>Our Collaborators</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Row 3: Donate & Contact Us */}
          <div className="sitemap-row">
            <div className="sitemap-section">
              <div className="sitemap-heading-with-items">
                <h2 className="sitemap-heading">Donate</h2>
                <ul>
                  <li>Make a Donation</li>
                </ul>
              </div>
            </div>
            <div className="sitemap-section">
              <div className="sitemap-heading-with-items">
                <h2 className="sitemap-heading">Contact Us</h2>
                <ul>
                  <li>Get in Touch</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
