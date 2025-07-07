import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-inner">
        <h1 className="privacy-policy-title">Privacy Policy</h1>
        <p>
          At <strong>Saayam for All</strong> ("Saayam," "we," "us," or "our"),
          your privacy is a top priority...
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li>
            <strong>Personal Identifiers:</strong> Name, email address, phone
            number, etc.
          </li>
          <li>
            <strong>Profile Information:</strong> Role, skills, availability.
          </li>
          <li>
            <strong>Location Data:</strong> Collected via IP or device.
          </li>
          <li>
            <strong>Usage Data:</strong> Pages visited, device/browser info.
          </li>
          <li>
            <strong>Request and Response Records:</strong> Service logs.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use your data to match requests with volunteers, enhance your
          experience, and ensure system performance. We never sell your data.
        </p>

        <h2>3. Information Sharing</h2>
        <p>
          Only shared with verified partners or legal authorities when
          necessary, under confidentiality agreements.
        </p>

        <h2>4. Data Retention</h2>
        <p>
          Data is retained as needed and securely deleted or anonymized when no
          longer required. Contact us to request deletion.
        </p>

        <h2>5. Security Measures</h2>
        <p>
          We use encryption, secure servers, and access controls. Breach
          notifications will follow applicable laws.
        </p>

        <h2>6. Your Rights</h2>
        <ul>
          <li>Access/update your data</li>
          <li>Request deletion</li>
          <li>Withdraw consent</li>
        </ul>

        <h2>7. Cookies</h2>
        <p>
          We use cookies for analytics and essential functionality. You may
          disable them in your browser settings.
        </p>

        <h2>8. Third-Party Links</h2>
        <p>
          We are not responsible for external links’ privacy practices. Please
          review their policies.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>We may update this policy. Continued use implies acceptance.</p>

        <h2>10. Contact Us</h2>
        <p>
          📧 <a href="mailto:info@SaayamForAll.org">info@SaayamForAll.org</a>
          <br />
          📍 Saayam for All, 3046 Rosato Ct., San Jose, California 95135
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
