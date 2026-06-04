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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PhoneNumberInputWithCountry from "../../common/components/PhoneNumberInputWithCountry";
import { isValidPhoneNumber } from "react-phone-number-input";
import PHONECODESEN from "../../utils/phone-codes-en";
import HorizontalAd from "#components/Ads/HorizontalAd";
import { sendContactEmail } from "../../services/contactServices";

// Contact reasons - Lambda will route emails based on the reason
const CONTACT_REASONS = [
  "VOLUNTEERING_INTERNSHIP",
  "TIMESHEET_ISSUES",
  "OFFER_RELIEVING_LETTER",
  "COLLABORATION_PARTNERSHIP",
  "GENERAL_INQUIRY",
];

const ContactUs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [phoneError, setPhoneError] = useState("");

  const faqs = [
    {
      question: t("What services does Saayam for All offer?"),
      answer: t(
        "We offer a platform to connect volunteers with people who need help in areas like education, food, and healthcare.",
      ),
    },
    {
      question: t("How can I become a volunteer?"),
      answer: t(
        "Fill out the contact form and our team will reach out with onboarding steps!",
      ),
    },
    {
      question: t("Is Saayam for All a non-profit?"),
      answer: t(
        "Yes, we are a non-profit organization focused on community support and outreach.",
      ),
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullPhoneNumber =
      PHONECODESEN[countryCode] &&
      `${PHONECODESEN[countryCode]["secondary"]}${phone}`;
    if (!formData.firstName.trim()) {
      newErrors.firstName = t("First Name is required");
    } else if (!nameRegex.test(formData.firstName.trim())) {
      newErrors.firstName = t("First Name should contain only letters");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("Last Name is required");
    } else if (!nameRegex.test(formData.lastName.trim())) {
      newErrors.lastName = t("Last Name should contain only letters");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("Email is required");
    } else if (!emailRegex.test(formData.email.trim())) {
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

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await sendContactEmail({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: fullPhoneNumber,
          message: formData.message,
          reason: formData.reason,
        });
        navigate("/thanks");
      } catch (error) {
        console.error("Contact form submission failed:", error);
        setSubmitError(
          t(
            "Failed to submit form. Please try again or contact us directly at hr@saayamforall.org",
          ),
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

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
              hr@saayamforall.org
            </p>

            <h1 className="text-2xl font-bold mb-4">{t("FAQ's")}</h1>
            <div className="w-full">
              {faqs.map((faq, index) => (
                <div key={index} className="mb-4 border-b border-gray-300 pb-2">
                  <button
                    className="text-left w-full flex justify-between items-center font-medium text-gray-800"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <span>
                      {openFAQIndex === index ? (
                        <KeyboardArrowUpIcon className="text-gray-600" />
                      ) : (
                        <KeyboardArrowDownIcon className="text-gray-600" />
                      )}
                    </span>
                  </button>
                  {openFAQIndex === index && (
                    <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
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

              {/* Reason for contacting drop down */}
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
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <span style={{ color: "#9e9e9e" }}>
                            {t("SELECT_A_REASON")}
                          </span>
                        );
                      }
                      return t(selected);
                    }}
                  >
                    {CONTACT_REASONS.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {t(reason)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.reason && (
                    <p className="text-xs text-red-600 mt-1 ml-3">
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
              {submitError && (
                <Alert severity="error" className="mb-4">
                  {submitError}
                </Alert>
              )}

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
