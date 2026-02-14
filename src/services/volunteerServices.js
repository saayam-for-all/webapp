import api from "./api";
import endpoints from "./endpoints.json";
import { fileToBase64 } from "../utils/fileToBase64";

export const getVolunteerOrgsList = async () => {
  const response = await api.get(endpoints.GET_VOLUNTEER_ORGS_LIST);
  return response.data;
};
export const getVolunteerSkills = async () => {
  const response = await api.get(endpoints.GET_VOLUNTEER_SKILLS);
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
    const response = await api.post(endpoints.GET_USER_ID, { email });
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error while fetching user ID";
    throw new Error(message);
  }
};

export const getVolunteersData = async () => {
  const { data } = await api.get(endpoints.GET_VOLUNTEERS_DATA);
  return Array.isArray(data?.body)
    ? data.body
    : Array.isArray(data)
      ? data
      : [];
};

/**
 * Upload profile image to S3 via backend (Base64 in JSON).
 * @param {string} userId - userDBId from Redux
 * @param {File} file - Image file (jpeg/png only)
 * @returns {Promise<void>}
 */
export const uploadProfileImage = async (userId, file) => {
  if (!userId) throw new Error("User ID is required");
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
 * @param {string} userId - userDBId from Redux
 * @returns {Promise<void>}
 */
export const deleteProfileImage = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  await api.delete(endpoints.DELETE_PROFILE_IMAGE, {
    data: { userId },
  });
};

/**
 * Fetch profile image as Blob; caller should create object URL and revoke on cleanup.
 * @param {string} userId - userDBId from Redux
 * @returns {Promise<Blob|null>} - Blob or null if 404/no image
 */
export const fetchProfileImage = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  try {
    const response = await api.post(
      endpoints.VIEW_PROFILE_IMAGE,
      { userId },
      { responseType: "blob" },
    );
    return response.data instanceof Blob ? response.data : null;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
};

/**
 * Sign off (delete) user from the database
 * @param {string} userId - The user's database ID (e.g., "SID-00-000-002-558")
 * @param {string} reason - Optional reason for leaving
 * @returns {Promise<Object>} - Returns { success: boolean, statusCode: number, message: string, data: { userId: string } }
 */
export const signOffUser = async (userId, reason = "") => {
  const response = await api.request({
    method: "DELETE",
    url: endpoints.SIGN_OFF_USER,
    data: {
      userId: userId,
      reason: reason,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
