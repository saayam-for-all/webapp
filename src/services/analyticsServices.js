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

// Organization Dashboard → Growth & Location tab.
// {} returns every pre-computed window (7D, 30D, 1Y, All).
// Custom trend: { start_date, end_date }; custom location: { location_start_date, location_end_date }.
// Optional filters: { organization_type, country }.
export const getGrowthTrendAnalytics = async (payload = {}) => {
  const response = await api.post(endpoints.GROWTH_TREND_ANALYTICS, payload);
  return response.data;
};
