import api from "./api";
import endpoints from "./endpoints.json";

export const getMyRequests = async (page = 1, limit = 50) => {
  const response = await api.get(
    `${endpoints.GET_MY_REQUESTS}?page=${page}&limit=${limit}`,
  );
  return response.data;
};
export const getOthersRequests = async (page = 1, limit = 50) => {
  const response = await api.get(
    `${endpoints.GET_OTHERS_REQUESTS}?page=${page}&limit=${limit}`,
  );
  return response.data;
};
export const getManagedRequests = async (page = 1, limit = 50) => {
  const response = await api.get(
    `${endpoints.GET_MANAGED_REQUESTS}?page=${page}&limit=${limit}`,
  );
  return response.data;
};

// New function to get all requests for admin/steward roles with pagination
export const getAllRequests = async (page = 1, limit = 50) => {
  const response = await api.get(
    `${endpoints.GET_MY_REQUESTS}?page=${page}&limit=${limit}&all=true`,
  );
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
