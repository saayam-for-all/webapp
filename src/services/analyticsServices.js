import api from "./api";
import endpoints from "./endpoints.json";

export const getBeneficiariesTrendAnalysis = async (payload) => {
  const response = await api.post(
    endpoints.BENEFICIARIES_TREND_ANALYSIS,
    payload,
  );
  return response.data;
};

export const getRequestsApplicationAnalytics = async (payload) => {
  const response = await api.post(
    endpoints.REQUEST_APPLICATION_ANALYTICS,
    payload,
  );
  return response.data;
};

// NOTE: Currently GET - will be migrated to POST with { fromDate, toDate } payload later
export const getKpiAnalytics = async (payload = {}) => {
  const response = await api.post(endpoints.GET_KPI_ANALYTICS, payload);
  return response.data;
};

export const getVolunteerApplicationAnalytics = async (payload = {}) => {
  const response = await api.post(
    endpoints.VOLUNTEER_APPLICATION_ANALYTICS,
    payload,
  );
  return response.data;
};
