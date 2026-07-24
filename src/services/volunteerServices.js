import api from "./api";
import endpoints from "./endpoints.json";
import { ACCEPTED_IMAGE_TYPES, fileToBase64 } from "../utils/fileToBase64";

const MAX_PROFILE_IMAGE_SIZE = 5_000_000;

// Temporary phone numbers used only with the mock volunteer endpoint.
// Replace these with approved mock/test numbers when they are available.
const MOCK_PHONE_NUMBERS = ["15551234567", "15557654321", "15559876543"];

const extractVolunteerArray = (data) => {
  if (Array.isArray(data?.body)) {
    return data.body;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

export const getVolunteerOrgsList = async () => {
  const response = await api.get(endpoints.GET_VOLUNTEER_ORGS_LIST);

  return response.data;
};

export const getVolunteerSkills = async () => {
  const response = await api.get(endpoints.GET_VOLUNTEER_SKILLS);

  return response.data;
};

/**
 * Fetch user skills by userId.
 *
 * @param {string} userId User database ID.
 * @returns {Promise<Object>} User skills response.
 */
export const fetchUserSkills = async (userId) => {
  const response = await api.post(endpoints.PROFILE_SKILLS, {
    userId,
  });

  return response.data;
};

/**
 * Update all skills for a user.
 *
 * @param {string} userId User database ID.
 * @param {string[]} skills Skill IDs.
 * @returns {Promise<Object>} API response.
 */
export const updateUserSkills = async (userId, skills) => {
  const response = await api.put(endpoints.PROFILE_SKILLS, {
    userId,
    skills,
  });

  return response.data;
};

/**
 * Delete user skills by sending the remaining skill list.
 *
 * @param {string} userId User database ID.
 * @param {string[]} skills Remaining skills.
 * @returns {Promise<Object>} API response.
 */
export const deleteUserSkills = async (userId, skills) => {
  const response = await api.delete(endpoints.PROFILE_SKILLS, {
    data: {
      userId,
      skills,
    },
  });

  return response.data;
};

export const createVolunteer = async (volunteerData) => {
  const response = await api.post(endpoints.CREATE_VOLUNTEER, volunteerData);

  return response.data;
};

export const updateVolunteer = async (volunteerData) => {
  const response = await api.put(endpoints.UPDATE_VOLUNTEER, volunteerData);

  return response.data;
};

export const getUserId = async (email) => {
  try {
    const response = await api.post(endpoints.GET_USER_ID, {
      email,
    });

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error while fetching user ID";

    throw new Error(message);
  }
};

/**
 * Real volunteers API.
 *
 * Do not use this function for the Issue 1656 Steward tab.
 * The Steward tab must continue using getMockVolunteersData.
 */
export const getVolunteersData = async () => {
  const response = await api.get(endpoints.GET_VOLUNTEERS_DATA);

  return extractVolunteerArray(response.data);
};

/**
 * Mock volunteers API used by the Steward Volunteers tab.
 *
 * The backend does not currently provide real volunteer data
 * for Issue 1656. Keep this mock endpoint call.
 *
 * Temporary phone numbers are added when the mock response
 * does not contain a phone number. This enables the steward
 * Send Message button for local testing.
 */
export const getMockVolunteersData = async () => {
  const response = await api.get(endpoints.MOCK_GET_VOLUNTEERS);

  const volunteers = extractVolunteerArray(response.data);

  return volunteers.map((volunteer, index) => ({
    ...volunteer,

    phoneNumber:
      volunteer.phoneNumber ||
      volunteer.phone ||
      volunteer.mobileNumber ||
      MOCK_PHONE_NUMBERS[index % MOCK_PHONE_NUMBERS.length],
  }));
};

/**
 * Upload profile image to S3 through the backend.
 *
 * @param {string} userId User database ID.
 * @param {File} file Profile image.
 * @returns {Promise<void>}
 */
export const uploadProfileImage = async (userId, file) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file");
  }

  const normalizedFileType = (file.type || "").toLowerCase();

  if (!ACCEPTED_IMAGE_TYPES.includes(normalizedFileType)) {
    throw new Error("Only JPG and PNG formats are accepted.");
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    throw new Error("File size must be 5 MB or less.");
  }

  const base64 = await fileToBase64(file);

  const contentType = file.type === "image/png" ? "image/png" : "image/jpeg";

  await api.post(endpoints.UPLOAD_PROFILE_IMAGE, {
    userId,
    contentType,
    base64,
  });
};

/**
 * Delete profile image.
 *
 * @param {string} userId User database ID.
 * @returns {Promise<void>}
 */
export const deleteProfileImage = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  await api.delete(endpoints.DELETE_PROFILE_IMAGE, {
    data: {
      userId,
    },
  });
};

/**
 * Fetch profile image as a Blob.
 *
 * @param {string} userId User database ID.
 * @returns {Promise<Blob|null>} Image Blob or null.
 */
export const fetchProfileImage = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const response = await api.post(
      endpoints.VIEW_PROFILE_IMAGE,
      {
        userId,
      },
      {
        responseType: "blob",
        headers: {
          Accept: "image/jpeg, image/png",
        },
      },
    );

    return response.data instanceof Blob ? response.data : null;
  } catch (error) {
    if (error?.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

/**
 * Sign off a user from the database.
 *
 * @param {string} userId User database ID.
 * @param {string} reason Optional reason.
 * @returns {Promise<Object>} API response.
 */
export const signOffUser = async (userId, reason = "") => {
  const response = await api.request({
    method: "DELETE",
    url: endpoints.SIGN_OFF_USER,
    data: {
      userId,
      reason,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
