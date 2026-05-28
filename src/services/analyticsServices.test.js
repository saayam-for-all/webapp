import api from "./api";
import { getBeneficiariesTrendAnalysis } from "./analyticsServices";

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
  });
});
