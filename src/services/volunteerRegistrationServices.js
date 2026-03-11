import api from "./api";
import endpoints from "./endpoints.json";

/**
 * Register a new volunteer
 * @param {Object} volunteerData - Form data from all steps (excluding files)
 * @returns {Promise<{submissionId: string}>}
 */
export const registerVolunteer = async (volunteerData) => {
  const response = await api.post(endpoints.REGISTER_VOLUNTEER, volunteerData);
  return response.data;
};

/**
 * Upload a document for volunteer registration
 * @param {Object} params
 * @param {File} params.file - The file to upload
 * @param {string} params.docType - Type of document (Resume, EAD_Card, i20, Government_ID)
 * @param {string} params.submissionId - The submission ID from registerVolunteer
 * @param {string} params.firstName - Volunteer's first name
 * @param {string} params.lastName - Volunteer's last name
 */
export const uploadVolunteerDocument = async ({
  file,
  docType,
  submissionId,
  firstName,
  lastName,
}) => {
  // Get presigned URL from backend
  const presignedResponse = await api.post(endpoints.GET_VOLUNTEER_UPLOAD_URL, {
    submissionId,
    fileName: `${firstName}_${lastName}_${docType}.pdf`,
    contentType: "application/pdf",
  });

  const { uploadUrl } = presignedResponse.data;

  // Upload file directly to S3 using presigned URL
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": "application/pdf",
    },
  });

  return { success: true };
};

/**
 * Get volunteer registration status
 * @param {string} submissionId
 * @returns {Promise<{status: string, message: string}>}
 */
export const getVolunteerRegistrationStatus = async (submissionId) => {
  const response = await api.get(
    `${endpoints.VOLUNTEER_REGISTRATION_STATUS}/${submissionId}`,
  );
  return response.data;
};
