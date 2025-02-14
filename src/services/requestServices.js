import api from "./api";
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
