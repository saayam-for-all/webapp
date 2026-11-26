import api from "./api";
import {
  getBeneficiariesTrendAnalysis,
  getRequestsApplicationAnalytics,
  getKpiAnalytics,
  getOrgGrowthTrendAnalytics,
  getOrgSizeContributionAnalytics,
  getOrgRatingTypeAnalytics,
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

    describe("getRequestsApplicationAnalytics", () => {
      const payload = {
        start_date: "2026-05-01",
        end_date: "2026-05-31",
      };

      it("calls POST to REQUEST_APPLICATION_ANALYTICS with payload and returns data", async () => {
        const mockData = {
          statusCode: 200,
          body: {
            request_volume_7_days: [{ date: "2026-06-24T00:00:00", count: 6 }],
          },
        };
        api.post.mockResolvedValue({ data: mockData });

        const result = await getRequestsApplicationAnalytics(payload);

        expect(api.post).toHaveBeenCalledWith(
          "v1/ml/requestApplicationAnalytics",
          payload,
        );
        expect(result).toEqual(mockData);
      });

      it("propagates errors from api", async () => {
        api.post.mockRejectedValue(new Error("Network error"));

        await expect(getRequestsApplicationAnalytics(payload)).rejects.toThrow(
          "Network error",
        );
      });
    });

    describe("getKpiAnalytics", () => {
      it("calls POST to GET_KPI_ANALYTICS with the given payload and returns data", async () => {
        const mockData = {
          "7D": {
            request_status_distribution: [{ status: "CREATED", count: 200 }],
            total_requests: [{ period: "2026-07-11", total_requests: 10 }],
            average_resolution_time_by_category: [],
          },
          sla: {
            target_days: 10,
            target_hours: 240,
            warning_days: 8.33,
            warning_hours: 200,
          },
        };
        api.post.mockResolvedValue({ data: mockData });

        const result = await getKpiAnalytics();

        expect(api.post).toHaveBeenCalledWith("v1/ml/kpiAnalytics", {});
        expect(result).toEqual(mockData);
      });

      it("passes a custom time_range payload through to the API", async () => {
        const mockData = {
          request_status_distribution: [],
          total_requests: [],
          average_resolution_time_by_category: [],
        };
        api.post.mockResolvedValue({ data: mockData });

        const payload = {
          time_range: "Custom",
          start_date: "2026-01-01",
          end_date: "2026-01-15",
        };
        const result = await getKpiAnalytics(payload);

        expect(api.post).toHaveBeenCalledWith("v1/ml/kpiAnalytics", payload);
        expect(result).toEqual(mockData);
      });

      it("propagates errors from api", async () => {
        api.post.mockRejectedValue(new Error("Network error"));
        await expect(getKpiAnalytics()).rejects.toThrow("Network error");
      });
    });
  });
});

describe("organization analytics services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each([
    [getOrgGrowthTrendAnalytics, "v1/ml/growth_trend_analytics"],
    [getOrgSizeContributionAnalytics, "v1/ml/size_contribution_analytics"],
    [getOrgRatingTypeAnalytics, "v1/ml/rating_type_analytics"],
  ])("%p", (service, path) => {
    it(`POSTs {} to ${path} by default and returns data`, async () => {
      api.post.mockResolvedValue({ data: { statusCode: 200 } });

      await expect(service()).resolves.toEqual({ statusCode: 200 });
      expect(api.post).toHaveBeenCalledWith(path, {});
    });

    it("passes a custom date range through", async () => {
      api.post.mockResolvedValue({ data: {} });
      const payload = { start_date: "2026-01-01", end_date: "2026-03-31" };

      await service(payload);
      expect(api.post).toHaveBeenCalledWith(path, payload);
    });

    it("propagates errors from api", async () => {
      api.post.mockRejectedValue(new Error("Network error"));
      await expect(service()).rejects.toThrow("Network error");
    });
  });
});
