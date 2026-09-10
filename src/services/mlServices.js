import api from "./api";
import endpoints from "./endpoints.json";

export const getOrganizations = async (payload) => {
  const response = await api.post(endpoints.ORG_AGGREGATOR_LIST, payload);
  return response.data;
};

export const getMockOrganizations = async (payload) => {
  const response = await api.get(endpoints.MOCK_ORG_DATA);
  return response.data;
};
