import api from "./api";
import endpoints from "./endpoints.json";
import { requestsData } from "../pages/Dashboard/data";

export const getMyRequests = async () => {
  try {
    const response = await api.get(endpoints.GET_MY_REQUESTS);
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
  try {
    const response = await api.get(endpoints.GET_OTHERS_REQUESTS);
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
  try {
    const response = await api.get(endpoints.GET_MANAGED_REQUESTS);
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
