import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BenevityLogo from "../../assets/donate_buttons/Benevity_logo.svg";
import CharityNavLogo from "../../assets/donate_buttons/CharityNav_Logo_Stack.png";
import PayPalLogo from "../../assets/donate_buttons/PayPal.svg";
import StripeLogo from "../../assets/donate_buttons/Stripe_Logo.png";
import donateImgBg from "../../assets/donate_img_bg.png";
import "./Donate.css";

const Donate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [showStripeDonation, setShowStripeDonation] = useState(false);
  const [donationType, setDonationType] = useState("one-time");
  const [selectedOption, setSelectedOption] = useState(null);

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
      question: t("Are donations tax deductible?"),
      answer: t("FAQ_TAX_ANSWER"),
    },
    {
      question: t("How will my donation be used?"),
      answer: t("FAQ_USE_ANSWER"),
    },
    {
      question: t("Can I cancel recurring donations?"),
      answer: t("FAQ_CANCEL_ANSWER"),
    },
  ];

  const donationOptions = [
    {
      key: "paypal",
      label: "PayPal",
      img: PayPalLogo,
      alt: "PayPal",
      href: "https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S",
    },
    {
      key: "stripe",
      label: "Stripe",
      img: StripeLogo,
      alt: "Stripe",
      href: null, // Stripe handled in code
    },
    {
      key: "charity",
      label: "Charity Navigator",
      img: CharityNavLogo,
      alt: "Charity Navigator",
      href: "https://www.charitynavigator.org/ein/932798273",
    },
    {
      key: "benevity",
      label: "Benevity",
      img: BenevityLogo,
      alt: "Benevity",
      href: "https://Benevity.org",
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
      <div
        data-testid="donate-image-overlay-bg"
        className="donate-image-overlay-bg"
      >
        <img
          className="donate-bg-image"
          alt="Donate background"
          src={donateImgBg}
        />
        <div className="donate-card-overlay">
          <h1 className="donate-title">{t("Make a donation")}</h1>
          <p className="donate-subtitle">
            {t(
              "Your donation helps us create lasting change in communities across the globe.",
            )}
          </p>
          <div className="donation-options-grid">
            {donationOptions.map((opt) => (
              <button
                key={opt.key}
                className={`donation-option-btn${selectedOption === opt.key ? " selected" : ""}`}
                onClick={() => {
                  if (opt.key === "stripe") {
                    handleStripeClick();
                  } else if (opt.key === "benevity") {
                    navigate("/benevity");
                  } else if (opt.href) {
                    window.open(opt.href, "_blank", "noopener,noreferrer");
                  }
                }}
                type="button"
              >
                <img
                  src={opt.img}
                  alt={opt.alt}
                  style={{
                    height: "25px",
                    width: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div data-testid="faq-section" className="faq-section">
        <h2 className="faq-title">{t("FAQ's")}</h2>
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
