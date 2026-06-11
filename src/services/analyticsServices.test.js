import api from "./api";
import {
  getBeneficiariesTrendAnalysis,
  getKpiAnalytics,
} from "./analyticsServices";

jest.mock("./api");

describe("analyticsServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBeneficiariesTrendAnalysis", () => {
    const payload = {
      beneficiaries_start_date: "2026-04-01",
      beneficiaries_end_date: "2026-04-30",
      help_requests_start_date: "2026-03-01",
      help_requests_end_date: "2026-04-30",
    };

    it("calls POST to BENEFICIARIES_TREND_ANALYSIS with payload and returns data", async () => {
      const mockData = {
        statusCode: 200,
        body: {
          "7 days beneficiaries": [{ Date: "2026-04-01T00:00:00", Count: 5 }],
        },
      };
      api.post.mockResolvedValue({ data: mockData });

      const result = await getBeneficiariesTrendAnalysis(payload);

      expect(api.post).toHaveBeenCalledWith(
        "v1/ml/beneficiariesTrendAnalysis",
        payload,
      );
      expect(result).toEqual(mockData);
    });

    it("propagates errors from api", async () => {
      api.post.mockRejectedValue(new Error("Network error"));

      await expect(getBeneficiariesTrendAnalysis(payload)).rejects.toThrow(
        "Network error",
      );
    });

    describe("getKpiAnalytics", () => {
      it("calls GET to GET_KPI_ANALYTICS and returns data", async () => {
        const mockData = {
          request_status_distribution: [{ status: "CREATED", count: 200 }],
          total_requests: 200,
          average_resolution_time_by_category: [],
          sla: {
            target_days: 10,
            target_hours: 240,
            warning_days: 8.33,
            warning_hours: 200,
          },
        };
        api.get.mockResolvedValue({ data: mockData });
        const result = await getKpiAnalytics();
        expect(api.get).toHaveBeenCalledWith("v1/ml/kpiAnalytics");
        expect(result).toEqual(mockData);
      });

      it("propagates errors from api", async () => {
        api.get.mockRejectedValue(new Error("Network error"));
        await expect(getKpiAnalytics()).rejects.toThrow("Network error");
      });
    });
  });
});
