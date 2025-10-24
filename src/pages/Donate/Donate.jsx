import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BenevityLogo from "../../assets/donate_buttons/Benevity_logo.svg";
import CharityNavLogo from "../../assets/donate_buttons/CharityNav_Logo_Stack.png";
import PayPalLogo from "../../assets/donate_buttons/PayPal.svg";
import StripeLogo from "../../assets/donate_buttons/Stripe_Logo.png";
import donateImgBg from "../../assets/donate_img_bg.png";
import RazorpayLogo from "../../assets/donate_buttons/RazorpayLogo.png";
import "./Donate.css";

const loadRazorpay = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });

const Donate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(null);
  const [showStripeDonation, setShowStripeDonation] = useState(false);
  const [donationType, setDonationType] = useState("one-time");
  const [selectedOption, setSelectedOption] = useState(null);

  // Razorpay only
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [rzAmountUsd, setRzAmountUsd] = useState("");
  const [rzMsg, setRzMsg] = useState("");
  // keep demo for now. switch to api later when backend is ready
  const RZ_MODE = "demo"; // "demo" or "api"
  const RZ_KEY_ID = "";   // set your key id when api is ready
  const RZ_API_BASE = "http://localhost:4000";

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    if (showStripeDonation) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/buy-button.js";
      script.async = true;
      document.body.appendChild(script);

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
    { question: t("Are donations tax deductible?"), answer: t("FAQ_TAX_ANSWER") },
    { question: t("How will my donation be used?"), answer: t("FAQ_USE_ANSWER") },
    { question: t("Can I cancel recurring donations?"), answer: t("FAQ_CANCEL_ANSWER") },
  ];

  const donationOptions = [
    {
      key: "paypal",
      label: "PayPal",
      img: PayPalLogo,
      alt: "PayPal",
      href: "https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S",
    },
    { key: "stripe", label: "Stripe", img: StripeLogo, alt: "Stripe", href: null },
    {
      key: "charity",
      label: "Charity Navigator",
      img: CharityNavLogo,
      alt: "Charity Navigator",
      href: "https://www.charitynavigator.org/ein/932798273",
    },
    { key: "benevity", label: "Benevity", img: BenevityLogo, alt: "Benevity", href: "https://Benevity.org" },
    // Razorpay button added here
    {
      key: "razorpay",
      label: "Razorpay",
      img: RazorpayLogo,
      alt: "Razorpay",
      href: null,
    },
  ];

  // Razorpay helpers
  const openRazorpay = async () => {
    setRzMsg("");
    if (!rzAmountUsd || Number(rzAmountUsd) <= 0) {
      setRzMsg("Please enter a valid amount");
      return;
    }

    if (RZ_MODE === "api") {
      await loadRazorpay();
      // create real order on backend
      const res = await fetch(`${RZ_API_BASE}/api/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountUsd: rzAmountUsd }),
      });
      if (!res.ok) {
        setRzMsg("Order create failed");
        return;
      }
      const order = await res.json();
      const opts = {
        key: RZ_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "Saayam",
        description: "Donation",
        handler: function (response) {
          alert("Payment successful " + response.razorpay_payment_id);
          setShowRazorpay(false);
        },
        theme: { color: "#3758F9" },
      };
      const rz = new window.Razorpay(opts);
      rz.on("payment.failed", () => setRzMsg("Payment failed. Please try again."));
      rz.open();
    } else {
      // demo only
      await new Promise((r) => setTimeout(r, 900));
      setRzMsg(`Simulated success for USD ${rzAmountUsd}`);
      await new Promise((r) => setTimeout(r, 800));
      setShowRazorpay(false);
    }
  };

  // Razorpay view inline without creating any new component
  if (showRazorpay) {
    return (
      <div className="donate-container">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto">
          <button onClick={() => setShowRazorpay(false)} className="back-button">
            ← Back to Donate
          </button>

          <h2 className="text-center mb-4">
            Donate with Razorpay {RZ_MODE === "demo" ? "(Demo)" : ""}
          </h2>

          <label className="block mb-2">Amount in USD</label>
          <input
            value={rzAmountUsd}
            onChange={(e) => setRzAmountUsd(e.target.value)}
            placeholder="25"
            className="w-full border rounded px-3 py-2 mb-4"
            type="number"
            min="1"
          />

          {rzMsg && <div className="text-sm mb-3">{rzMsg}</div>}

          <button className="primary-button w-full" onClick={openRazorpay}>
            Continue
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Demo mode simulates checkout and success without real charges.
          </p>
        </div>
      </div>
    );
  }

  if (showStripeDonation) {
    return (
      <div className="donate-container">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto">
          <button onClick={() => setShowStripeDonation(false)} className="back-button">
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
            <div className="flex flex-col items-center space-y-6" id="monthly-button-container"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="donate-container" className="donate-container">
      <div data-testid="donate-image-overlay-bg" className="donate-image-overlay-bg">
        <img className="donate-bg-image" alt="Donate background" src={donateImgBg} />
        <div className="donate-card-overlay">
          <h1 className="donate-title">{t("Make a Donation")}</h1>
          <p className="donate-subtitle">
            {t("Your donation helps us create lasting change in communities across the globe.")}
          </p>
          <div className="donation-options-grid">
            {donationOptions.map((opt) => (
              <button
                key={opt.key}
                className={`donation-option-btn${selectedOption === opt.key ? " selected" : ""}`}
                onClick={() => {
                  if (opt.key === "stripe") {
                    setShowStripeDonation(true);
                  } else if (opt.key === "benevity") {
                    navigate("/benevity");
                  } else if (opt.key === "razorpay") {
                    setShowRazorpay(true);
                  } else if (opt.href) {
                    window.open(opt.href, "_blank", "noopener,noreferrer");
                  }
                }}
                type="button"
              >
                <img
                  src={opt.img}
                  alt={opt.alt}
                  style={{ height: "25px", width: "auto", display: "block", margin: "0 auto" }}
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
                <svg className={`faq-icon ${openFaq === index ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donate;
