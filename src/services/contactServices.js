import axios from "axios";

// Contact Lambda rejects requests slower than this anyway; without a client
// timeout a hung gateway would leave the form spinner stuck forever.
const CONTACT_REQUEST_TIMEOUT_MS = 15000;

/**
 * Send contact form email via Lambda (no authentication required).
 * The endpoint comes from VITE_CONTACT_API_URL and is validated here, not at
 * module scope, so a missing value degrades only the Contact form instead of
 * crashing every page that transitively imports this module.
 * @param {Object} data - Form data
 * @param {string} data.firstName - First name
 * @param {string} data.lastName - Last name
 * @param {string} data.middleName - Honeypot field (empty for real users)
 * @param {string} data.email - Email address
 * @param {string} data.phone - Phone number (E.164)
 * @param {string} data.message - Message content
 * @param {string} data.reason - Lambda RECIPIENT_MAP routing key
 * @param {string} data.recaptchaToken - reCAPTCHA v3 token
 * @returns {Promise<Object>} API response body
 */
export const sendContactEmail = async ({
  firstName,
  lastName,
  middleName,
  email,
  phone,
  message,
  reason,
  recaptchaToken,
}) => {
  const url = import.meta.env.VITE_CONTACT_API_URL;
  if (!url) {
    throw new Error("Contact service is not configured");
  }

  const payload = {
    email,
    name: `${firstName} ${lastName}`,
    middleName,
    phone,
    message,
    reason,
    recaptchaToken,
  };

  const response = await axios.post(url, payload, {
    timeout: CONTACT_REQUEST_TIMEOUT_MS,
  });
  return response.data;
};
