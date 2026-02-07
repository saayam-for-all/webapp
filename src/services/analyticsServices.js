import api from "./api";
import endpoints from "./endpoints.json";

export const getBeneficiariesTrendAnalysis = async () => {
  const response = await api.post(endpoints.BENEFICIARIES_TREND_ANALYSIS, {
    action: "create_tables",
  });
  return response.data;
};
