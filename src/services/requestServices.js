import api from "./api";
import endpoints from "./endpoints.json";
import { requestsData } from "../pages/Dashboard/data";

// TEMPORARY: Force use of mock data until API is updated with new categories
// TODO: Set to false once backend API has new category structure
const USE_MOCK_DATA = true;

export const getMyRequests = async () => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data (forced for testing)");
    return { body: requestsData.myRequests.data };
  }

  try {
    const response = await api.get(endpoints.GET_MY_REQUESTS);
    // If API returns empty data, fallback to mock data
    if (
      !response.data ||
      !response.data.body ||
      !Array.isArray(response.data.body) ||
      response.data.body.length === 0
    ) {
      console.warn("API returned empty data, using mock data fallback");
      return { body: requestsData.myRequests.data };
    }
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch my requests from API, using mock data:",
      error.message,
    );
    return { body: requestsData.myRequests.data };
  }
};

export const getOthersRequests = async () => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data (forced for testing)");
    return { body: requestsData.othersRequests.data };
  }

  try {
    const response = await api.get(endpoints.GET_OTHERS_REQUESTS);
    // If API returns empty data, fallback to mock data
    if (
      !response.data ||
      !response.data.body ||
      !Array.isArray(response.data.body) ||
      response.data.body.length === 0
    ) {
      console.warn("API returned empty data, using mock data fallback");
      return { body: requestsData.othersRequests.data };
    }
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch others requests from API, using mock data:",
      error.message,
    );
    return { body: requestsData.othersRequests.data };
  }
};

export const getManagedRequests = async () => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data (forced for testing)");
    return { body: requestsData.managedRequests.data };
  }

  try {
    const response = await api.get(endpoints.GET_MANAGED_REQUESTS);
    // If API returns empty data, fallback to mock data
    if (
      !response.data ||
      !response.data.body ||
      !Array.isArray(response.data.body) ||
      response.data.body.length === 0
    ) {
      console.warn("API returned empty data, using mock data fallback");
      return { body: requestsData.managedRequests.data };
    }
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch managed requests from API, using mock data:",
      error.message,
    );
    return { body: requestsData.managedRequests.data };
  }
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

export const getEmergencyContactInfo = async () => {
  const response = await api.get(endpoints.GET_EMERGENCY_CONTACT);
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
