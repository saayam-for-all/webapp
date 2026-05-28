import api from "./api";
import endpoints from "./endpoints.json";

export const getBeneficiariesTrendAnalysis = async (payload) => {
  const response = await api.post(
    endpoints.BENEFICIARIES_TREND_ANALYSIS,
    payload,
  );
  return response.data;
};
