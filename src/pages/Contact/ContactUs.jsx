import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import PhoneNumberInputWithCountry from "../../common/components/PhoneNumberInputWithCountry";
import { isValidPhoneNumber } from "react-phone-number-input";
import PHONECODESEN from "../../utils/phone-codes-en";
import HorizontalAd from "#components/Ads/HorizontalAd";
import { sendContactEmail } from "../../services/contactServices";

// Single source of truth: each entry drives both the dropdown option and the
// Lambda RECIPIENT_MAP routing key, so the two can never drift apart.
const CONTACT_REASONS = [
  { translationKey: "VOLUNTEERING_INTERNSHIP", apiValue: "Volunteer" },
  { translationKey: "TIMESHEET_ISSUES", apiValue: "Timesheet" },
  { translationKey: "OFFER_RELIEVING_LETTER", apiValue: "Letters" },
  { translationKey: "COLLABORATION_PARTNERSHIP", apiValue: "Collaboration" },
  { translationKey: "GENERAL_INQUIRY", apiValue: "General" },
  { translationKey: "DONATION_GRANT", apiValue: "Donation" },
];

const NAME_REGEX = /^[A-Za-z\s]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Mirrors the contact Lambda's validation so users get feedback client-side
// instead of a server 400.
const NAME_MAX_LENGTH = 100;
const MESSAGE_MAX_LENGTH = 2000;

const FAQ_CONTENT = [
  {
    question: "What services does Saayam for All offer?",
    answer:
      "We offer a platform to connect volunteers with people who need help in areas like education, food, and healthcare.",
  },
  {
    question: "How can I become a volunteer?",
    answer:
      "Fill out the contact form and our team will reach out with onboarding steps!",
  },
  {
    question: "Is Saayam for All a non-profit?",
    answer:
      "Yes, we are a non-profit organization focused on community support and outreach.",
  },
];

// Owns its open/closed state so toggling FAQs never re-renders the form, and
// form keystrokes never re-render the FAQ list (memo + stable faqs prop).
const FaqAccordion = memo(function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = useCallback((index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="w-full">
      {faqs.map((faq, index) => (
        <div key={faq.question} className="mb-4 border-b border-gray-300 pb-2">
          <button
            type="button"
            className="text-left w-full flex justify-between items-center font-medium text-gray-800"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <span>{faq.question}</span>
            <span>
              {openIndex === index ? (
                <KeyboardArrowUpIcon className="text-gray-600" />
              ) : (
                <KeyboardArrowDownIcon className="text-gray-600" />
              )}
            </span>
          </button>
          {openIndex === index && (
            <p
              id={`faq-answer-${index}`}
              className="text-sm text-gray-600 mt-2"
            >
              {faq.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
});

FaqAccordion.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const ContactUs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "", // honeypot field
    email: "",
    message: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [phoneError, setPhoneError] = useState("");

  // Blocks setState/navigate from a submit that resolves after the user has
  // already navigated away.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const faqs = useMemo(
    () =>
      FAQ_CONTENT.map(({ question, answer }) => ({
        question: t(question),
        answer: t(answer),
      })),
    [t],
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const newErrors = {};
      const fullPhoneNumber =
        PHONECODESEN[countryCode] &&
        `${PHONECODESEN[countryCode]["secondary"]}${phone}`;

      if (!formData.firstName.trim()) {
        newErrors.firstName = t("First Name is required");
      } else if (!NAME_REGEX.test(formData.firstName.trim())) {
        newErrors.firstName = t("First Name should contain only letters");
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = t("Last Name is required");
      } else if (!NAME_REGEX.test(formData.lastName.trim())) {
        newErrors.lastName = t("Last Name should contain only letters");
      }
      if (!formData.email.trim()) {
        newErrors.email = t("Email is required");
      } else if (!EMAIL_REGEX.test(formData.email.trim())) {
        newErrors.email = t("Email is invalid");
      }
      if (!phone) {
        newErrors.phone = t("Phone is required");
      } else if (!fullPhoneNumber || !isValidPhoneNumber(fullPhoneNumber)) {
        newErrors.phone = t("Please enter a valid phone number");
      }
      if (!formData.reason) {
        newErrors.reason = t("Please select a reason for contacting");
      }
      if (!formData.message) {
        newErrors.message = t("Message is required");
      }

      setErrors(newErrors);
      setPhoneError(newErrors.phone || "");
      setSubmitError("");

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      if (!executeRecaptcha) {
        setSubmitError(
          t("reCAPTCHA not ready. Please refresh the page and try again."),
        );
        return;
      }

      setIsSubmitting(true);
      try {
        const recaptchaToken = await executeRecaptcha("contact_form_submit");

        await sendContactEmail({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          middleName: formData.middleName, // honeypot — Lambda validates
          email: formData.email.trim(),
          phone: fullPhoneNumber,
          reason: formData.reason,
          message: formData.message,
          recaptchaToken,
        });

        if (isMountedRef.current) {
          navigate("/thanks");
        }
      } catch (error) {
        console.error("Contact form submission failed:", error);
        if (isMountedRef.current) {
          setSubmitError(
            t(
              "Failed to submit form. Please try again or contact us directly at info@saayamforall.org",
            ),
          );
        }
      } finally {
        if (isMountedRef.current) {
          setIsSubmitting(false);
        }
      }
    },
    [formData, phone, countryCode, executeRecaptcha, navigate, t],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="bg-[#F5F5F5] min-h-screen flex flex-col p-8">
        <div className="flex flex-col md:flex-row w-full gap-6">
          {/* Left Column: Contact Info + FAQ */}
          <div className="flex flex-col w-full md:w-1/2 p-4">
            <h1 className="text-3xl font-bold mb-2">{t("Contact Us")}</h1>
            <p className="text-[#807D7D] text-lg mb-4">
              {t(
                "Email, call, or complete the form to learn how Saayam for All can help you with your challenges",
              )}
            </p>
            <p className="text-[#807D7D] text-base mb-10">
              info@saayamforall.org
            </p>

            <h1 className="text-2xl font-bold mb-4">{t("FAQ's")}</h1>
            <FaqAccordion faqs={faqs} />
          </div>

          {/* Right Column: Form */}
          <div className="w-full md:w-1/2 p-4">
            <Box
              component="form"
              onSubmit={handleSubmit}
              className="w-full max-w-2xl bg-white p-6 rounded-3xl shadow-md"
            >
              <h1 className="text-2xl font-bold mb-1">{t("Get In Touch")}</h1>
              <p className="text-sm text-[#807D7D] mb-4">
                {t("You can reach us anytime")}
              </p>

              {/* First Name */}
              <div className="mb-4">
                <label
                  htmlFor="firstName"
                  className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
                >
                  <span className="text-red-500 mr-1">*</span>
                  {t("First Name")}
                </label>
                <TextField
                  id="firstName"
                  name="firstName"
                  placeholder={t("Enter your first name")}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  inputProps={{ maxLength: NAME_MAX_LENGTH }}
                />
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label
                  htmlFor="lastName"
                  className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
                >
                  <span className="text-red-500 mr-1">*</span>
                  {t("Last Name")}
                </label>
                <TextField
                  id="lastName"
                  name="lastName"
                  placeholder={t("Enter your last name")}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  inputProps={{ maxLength: NAME_MAX_LENGTH }}
                />
              </div>

              {/* Honeypot field — hidden from real users */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  opacity: 0,
                  height: 0,
                  overflow: "hidden",
                }}
              >
                <label htmlFor="middleName">Middle Name</label>
                <TextField
                  id="middleName"
                  name="middleName"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
                >
                  <span className="text-red-500 mr-1">*</span>
                  {t("Email")}
                </label>
                <TextField
                  id="email"
                  name="email"
                  placeholder={t("Enter your email")}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
                >
                  <span className="text-red-500 mr-1">*</span>
                  {t("Phone")} ({t("preferably WhatsApp")})
                </label>
                <PhoneNumberInputWithCountry
                  phone={phone}
                  setPhone={setPhone}
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                  error={phoneError}
                  setError={setPhoneError}
                  required={true}
                  t={t}
                  hideLabel={true}
                />
              </div>

              {/* Reason for contacting dropdown */}
              <div className="mb-4">
                <label
                  htmlFor="reason"
                  className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
                >
                  <span className="text-red-500 mr-1">*</span>
                  {t("REASON_FOR_CONTACTING")}
                </label>
                <FormControl
                  fullWidth
                  margin="dense"
                  error={!!errors.reason}
                  required
                >
                  <Select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    displayEmpty
                    SelectDisplayProps={{
                      "aria-describedby": errors.reason
                        ? "reason-error"
                        : undefined,
                    }}
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <span style={{ color: "#9e9e9e" }}>
                            {t("SELECT_A_REASON")}
                          </span>
                        );
                      }
                      const selectedReason = CONTACT_REASONS.find(
                        (reason) => reason.apiValue === selected,
                      );
                      return selectedReason
                        ? t(selectedReason.translationKey)
                        : selected;
                    }}
                  >
                    {CONTACT_REASONS.map(({ translationKey, apiValue }) => (
                      <MenuItem key={apiValue} value={apiValue}>
                        {t(translationKey)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.reason && (
                    <p
                      id="reason-error"
                      className="text-xs text-red-600 mt-1 ml-3"
                    >
                      {errors.reason}
                    </p>
                  )}
                </FormControl>
              </div>

              {/* Message */}
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
                >
                  <span className="text-red-500 mr-1">*</span>
                  {t("Message")}
                </label>
                <TextField
                  id="message"
                  name="message"
                  placeholder={t("Enter your message")}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  error={!!errors.message}
                  helperText={errors.message}
                  inputProps={{ maxLength: MESSAGE_MAX_LENGTH }}
                />
              </div>

              {/* Response Time Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">{t("NOTE_LABEL")}</span>{" "}
                  {t("RESPONSE_TIME_NOTICE")}
                </p>
              </div>

              {/* Error Alert */}
              <div aria-live="polite">
                {submitError && (
                  <Alert severity="error" className="mb-4">
                    {submitError}
                  </Alert>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                className="mt-4 rounded-[24px]"
                style={{
                  borderRadius: "24px",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("Submit")
                )}
              </Button>

              <p className="text-sm text-gray-500 mt-4 text-center">
                {t("*By clicking Submit, you are agreeing to our")}{" "}
                <a
                  href="/terms-and-conditions"
                  className="text-blue-600 hover:underline"
                >
                  {t("terms and conditions")}
                </a>
                .
              </p>

              {/* reCAPTCHA Privacy Notice (required by Google) */}
              <p className="text-xs text-gray-400 mt-3 text-center leading-relaxed">
                {t("This site is protected by reCAPTCHA and the Google")}{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {t("Privacy Policy")}
                </a>{" "}
                {t("and")}{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {t("Terms of Service")}
                </a>{" "}
                {t("apply")}.
              </p>
            </Box>
          </div>
        </div>
      </div>
      <div className="overflow-hidden mt-2">
        <HorizontalAd />
      </div>
    </>
  );
};

export default ContactUs;
