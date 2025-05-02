import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import handsTogetherImage from "../../assets/hands-together.png";
import qrCodeImage from "../../assets/QR.png";
import "./Donate.css";

const Donate = () => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "Are donations tax deductible?",
      answer: t("FAQ_TAX_ANSWER"),
    },
    {
      question: "How will my donation be used?",
      answer: t("FAQ_USE_ANSWER"),
    },
    {
      question: "Can I cancel recurring donations?",
      answer: t("FAQ_CANCEL_ANSWER"),
    },
  ];

  return (
    <div data-testid="donate-container" className="donate-container">
      <div data-testid="donate-grid" className="donate-grid">
        <div
          data-testid="donate-image-container"
          className="donate-image-container"
        >
          <img
            className="donate-image"
            alt="People helping each other"
            src={handsTogetherImage}
          />
        </div>
        <div data-testid="donate-content" className="donate-content">
          <div>
            <h1 className="donate-title">Make a Donation</h1>
            <p className="donate-subtitle">
              Your contribution helps us continue our mission of providing
              assistance to those in need.
            </p>

            <div className="donation-buttons">
              <a
                className="donate-button-paypal"
                href="https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donate via PayPal
              </a>
              <a
                href="#"
                className="donate-button-razorpay"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donate via RazorPay
              </a>
              <a
                href="#"
                className="donate-button-stripe"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donate via Stripe
              </a>
            </div>

            <div className="qr-section">
              <h2 className="qr-title">Scan to Donate</h2>
              <p className="qr-description">
                Scan this QR code with your mobile device to make a donation
              </p>
              <div className="qr-code-container">
                <img
                  src={qrCodeImage}
                  alt="Donation QR Code"
                  className="qr-code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-testid="faq-section" className="faq-section">
        <h2 className="faq-title">FAQ's</h2>
        <div className="faq-list">
          {faqItems.map((faq, index) => (
            <div key={index} className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                {faq.question}
                <svg
                  className={`faq-icon ${openFaq === index ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donate;
