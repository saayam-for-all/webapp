import api from "./api";
// import axios from "axios";
import endpoints from "./endpoints.json";

export const getMyRequests = async () => {
  const response = await api.get(endpoints.GET_MY_REQUESTS);
  return response.data;
};

export const getOthersRequests = async () => {
  const response = await api.get(endpoints.GET_OTHERS_REQUESTS);
  return response.data;
};

export const getManagedRequests = async () => {
  const response = await api.get(endpoints.GET_MANAGED_REQUESTS);
  return response.data;
};

export const getComments = async () => {
  const response = await api.get(endpoints.GET_REQUEST_COMMENTS);
  return response.data;
};

export const checkProfanity = async (content) => {
  const response = await api.post(endpoints.CHECK_PROFANITY, content);
  return response.data;
};

export const createRequest = async (request) => {
  const response = await api.post(endpoints.CREATE_HELP_REQUEST, request);
  return response.data;
};

export const getEmergencyContactInfo = async ({ lat, lng } = {}) => {
  const response = await api.get(endpoints.GET_EMERGENCY_CONTACT, {
    params:
      typeof lat === "number" && typeof lng === "number"
        ? { lat, lng }
        : undefined,
  });
  return response.data;
};

export const predictCategories = async (request) => {
  const response = await api.post(endpoints.PREDICT_CATEGORIES, request);
  return response.data;
};

export const GET_NOTIFICATIONS = async () => {
  const response = await api.get(endpoints.GET_NOTIFICATIONS);
  return response.data;
};

export const moreInformation = async (request) => {
  const response = await api.post(endpoints.GENERATE_ANSWER, request);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get(endpoints.GET_CATEGORIES);
  return response.data;
};

export const getEnums = async () => {
  const response = await api.get(endpoints.GET_ENUMS);
  return response.data;
};

export const getMetadata = async () => {
  const response = await api.get(endpoints.GET_METADATA);
  return response.data;
};

export const getEnvironment = async () => {
  const response = await api.get(endpoints.GET_ENVIRONMENT);
  return response.data;
};

export const uploadRequestFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    endpoints.UPLOAD_REQUEST_FILE, // <-- add this key to endpoints.json
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const speechDetectV2 = async (audioContent) => {
  const response = await api.post(endpoints.SPEECH_DETECT_V2, {
    audioContent,
  });
  return response.data;
};

/**
 * Sign off (delete) user from the database
 * @param {string} userId - The user's database ID (e.g., "SID-00-000-002-556")
 * @param {string} reason - Optional reason for leaving
 * @returns {Promise<Object>} - Returns { success: boolean, statusCode: number, message: string, data: { userId: string } }
 */
export const signOffUser = async (userId, reason = "") => {
  const requestBody = {
    userId: userId,
    reason: reason,
  };

  const response = await api.request({
    method: "DELETE",
    url: endpoints.SIGN_OFF_USER,
    data: requestBody,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Parse the body if it's a string (AWS Lambda response format)
  const data = response.data;
  if (data.body && typeof data.body === "string") {
    return JSON.parse(data.body);
  }
  return data;
};
