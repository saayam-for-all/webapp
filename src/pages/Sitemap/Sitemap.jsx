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
                  <li>
                    <a href="/">Saayam for all Home</a>
                  </li>
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
                  <li>
                    <a href="/our-mission">Our Mission</a>
                  </li>
                  <li>
                    <a href="/our-team">Our Team</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="sitemap-section">
              <div className="sitemap-heading-with-items">
                <h2 className="sitemap-heading">Volunteer Services</h2>
                <ul>
                  <li>
                    <a href="/how-we-operate">How We Operate</a>
                  </li>
                  <li>
                    <a href="/collaborators">Our Collaborators</a>
                  </li>
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
                  <li>
                    <a href="/donate">Make a Donation</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="sitemap-section">
              <div className="sitemap-heading-with-items">
                <h2 className="sitemap-heading">Contact Us</h2>
                <ul>
                  <li>
                    <a href="/contact">Get in Touch</a>
                  </li>
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
