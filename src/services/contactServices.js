import { publicApi } from "./api";
import endpoints from "./endpoints.json";

/**
 * Send contact form email via Lambda (no authentication required)
 * @param {Object} data - Form data
 * @param {string} data.firstName - First name
 * @param {string} data.lastName - Last name
 * @param {string} data.email - Email address
 * @param {string} data.phone - Phone number
 * @param {string} data.message - Message content
 * @param {string} data.reason - Reason for contacting
 * @returns {Promise} - API response
 */
export const sendContactEmail = async ({
  firstName,
  lastName,
  email,
  phone,
  message,
  reason,
}) => {
  const payload = {
    email,
    name: `${firstName} ${lastName}`,
    phone,
    message,
    reason,
  };

  console.log(payload);

  const response = await publicApi.post(endpoints.SEND_CONTACT_EMAIL, payload);
  return response.data;
};
