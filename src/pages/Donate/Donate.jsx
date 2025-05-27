import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import handsTogetherImage from "../../assets/hands-together.png";
import qrCodeImage from "../../assets/QR.png";
import "./Donate.css";

const Donate = () => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

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
    <div>
      {}
      <div className="donate-container">
        {}
        <div
          className="w-full flex justify-start px-4 mt-4 mb-4"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
          >
            <span className="text-2xl mr-2">&lt;</span> Back
          </button>
        </div>
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
                  <a
                    href="https://www.charitynavigator.org/ein/932798273"
                    className="donate-button-charity"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Donate via Charity Navigator
                  </a>
                  <a
                    href="https://Benevity.org"
                    className="donate-button-benevity"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Donate via Benevity
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div data-testid="faq-section" className="faq-section">
            <h2 className="faq-title">FAQ's</h2>
            <div className="faq-list">
              {faqItems.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
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
      </div>
    </div>
  );
};

export default Donate;
