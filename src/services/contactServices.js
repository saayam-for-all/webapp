import { publicApi } from "./api";
import endpoints from "./endpoints.json";
import axios from "axios";

/**
 * Send contact form email via Lambda (no authentication required)
 * @param {Object} data - Form data
 * @param {string} data.firstName - First name
 * @param {string} data.lastName - Last name
 * @param {string} data.email - Email address
 * @param {string} data.phone - Phone number
 * @param {string} data.message - Message content
 * @param {string} data.reason - Reason for contacting
 * @param {string} data.recaptchaToken - reCAPTCHA v3 token for verification
 * @returns {Promise} - API response
 */
export const sendContactEmail = async ({
  firstName,
  lastName,
  email,
  phone,
  message,
  reason,
  recaptchaToken,
}) => {
  const payload = {
    email,
    name: `${firstName} ${lastName}`,
    phone,
    message,
    reason,
    recaptchaToken,
  };

  const response = await axios.post(endpoints.SEND_CONTACT_EMAIL, payload);
  return response.data;
};
