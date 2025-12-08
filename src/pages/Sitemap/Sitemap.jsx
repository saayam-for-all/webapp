import React from "react";
import "./Sitemap.css";
import { useNavigate, Link } from "react-router-dom";

const Sitemap = () => {
  const navigate = useNavigate();

  return (
    <div className="sitemap-container">
      <div className="sitemap-inner">
        <div className="w-full mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
          >
            <span className="text-2xl mr-2">&lt;</span> Back
          </button>
        </div>
        <h1 className="sitemap-title">Sitemap</h1>
        <div className="sitemap-content-wrapper">
          {/* Row 1: Home */}
          <div className="sitemap-row">
            <div className="sitemap-heading-with-items">
              <div className="sitemap-section">
                <h2 className="sitemap-heading">Home</h2>
                <ul>
                  <li>
                    <Link to="/">Saayam for all Home</Link>
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
                    <Link to="/our-mission">Our Mission</Link>
                  </li>
                  <li>
                    <Link to="/our-team">Our Team</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="sitemap-section">
              <div className="sitemap-heading-with-items">
                <h2 className="sitemap-heading">Volunteer Services</h2>
                <ul>
                  <li>
                    <Link to="/how-we-operate">How We Operate</Link>
                  </li>
                  <li>
                    <Link to="/collaborators">Our Collaborators</Link>
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
                    <Link to="/donate">Make a Donation</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="sitemap-section">
              <div className="sitemap-heading-with-items">
                <h2 className="sitemap-heading">Contact Us</h2>
                <ul>
                  <li>
                    <Link to="/contact">Get in Touch</Link>
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
