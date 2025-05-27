import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import handsTogetherImage from "../../assets/hands-together.png";
import qrCodeImage from "../../assets/QR.png";
import "./Donate.css";

const Donate = () => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);
  const [showStripeDonation, setShowStripeDonation] = useState(false);
  const [donationType, setDonationType] = useState("one-time");

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    if (showStripeDonation) {
      // Load Stripe script
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/buy-button.js";
      script.async = true;
      document.body.appendChild(script);

      // Initialize Stripe buttons after script loads
      script.onload = () => {
        const publishableKey =
          "pk_live_51RLYdDFTNrTBTK6lenmwJGxbrv1uxOqKWi4GnpWIocFGTpIJNVr7p4OwP0n2vcJwp8c89vw7fOHGFISOAMYtOwUZ002no86gkT";
        const stripeButtons = {
          oneTime: "buy_btn_1ROTosFTNrTBTK6lack9IclC",
          monthly: "buy_btn_1ROTobFTNrTBTK6lJdV1DIpA",
        };

        const insertStripeButton = (containerId, buttonId) => {
          const container = document.getElementById(containerId);
          if (container) {
            const btn = document.createElement("stripe-buy-button");
            btn.setAttribute("buy-button-id", buttonId);
            btn.setAttribute("publishable-key", publishableKey);
            container.appendChild(btn);
          }
        };

        insertStripeButton("one-time-button-container", stripeButtons.oneTime);
        insertStripeButton("monthly-button-container", stripeButtons.monthly);
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showStripeDonation]);

  const handleStripeClick = () => {
    setShowStripeDonation(true);
  };

  const selectType = (type) => {
    setDonationType(type);
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

  if (showStripeDonation) {
    return (
      <div className="donate-container">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto">
          <button
            onClick={() => setShowStripeDonation(false)}
            className="back-button"
          >
            ← Back to Donate
          </button>
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => selectType("one-time")}
              className={`tab-btn ${donationType === "one-time" ? "active" : ""}`}
            >
              One-Time
            </button>
            <button
              onClick={() => selectType("monthly")}
              className={`tab-btn ${donationType === "monthly" ? "active" : ""}`}
            >
              Monthly
            </button>
          </div>

          <div
            id="section-one-time"
            className={`donation-section ${donationType === "one-time" ? "" : "hidden"}`}
          >
            <div id="one-time-button-container"></div>
          </div>

          <div
            id="section-monthly"
            className={`donation-section ${donationType === "monthly" ? "" : "hidden"}`}
          >
            <div
              className="flex flex-col items-center space-y-6"
              id="monthly-button-container"
            ></div>
          </div>
        </div>
      </div>
    );
  }

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
              <button
                onClick={handleStripeClick}
                className="donate-button-stripe"
              >
                Donate via Stripe
              </button>
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
