import { getRatingTypePayload, mapRatingTypeAnalytics } from "./ratingTypeData";

const empty = {
  rating_distribution: [],
  organization_mix_trend: { for_profit: [], non_profit: [] },
};
const sample = {
  rating_distribution: [
    { rating: 1, count: 2 },
    { rating: 2, count: 10 },
    { rating: 3, count: 35 },
    { rating: 4, count: 73 },
    { rating: 5, count: 83 },
  ],
  organization_mix_trend: {
    for_profit: [{ period: "2025-11", count: 56 }],
    non_profit: [{ period: "2025-11", count: 104 }],
  },
};
const custom = {
  rating_distribution: [
    { rating: 4, count: 1 },
    { rating: 5, count: 3 },
  ],
  organization_mix_trend: {
    for_profit: [{ period: "2026-01-29", count: 8 }],
    non_profit: [{ period: "2026-01-25", count: 19 }],
  },
};

describe("Rating and type analytics", () => {
  it("uses an empty payload for preset periods", () => {
    for (const range of ["7d", "30d", "1Y", "all"]) {
      expect(getRatingTypePayload(range)).toEqual({});
    }
  });
  it("sends custom dates and a country when supplied", () => {
    expect(
      getRatingTypePayload("custom", "2026-01-01", "2026-03-31", "USA"),
    ).toEqual({
      start_date: "2026-01-01",
      end_date: "2026-03-31",
      country: "USA",
    });
  });
  it("rejects incomplete or reversed custom dates", () => {
    expect(() => getRatingTypePayload("custom", "2026-01-01", "")).toThrow();
    expect(() =>
      getRatingTypePayload("custom", "2026-03-31", "2026-01-01"),
    ).toThrow();
  });
  it("parses the documented string body and maps rating and trend fields", () => {
    const data = mapRatingTypeAnalytics(
      { statusCode: 200, body: JSON.stringify({ "1Y": sample }) },
      "1Y",
    );
    expect(data.byRating.map((row) => row.organizations)).toEqual([
      2, 10, 35, 73, 83,
    ]);
    expect(data.profitTrend).toEqual([
      { period: "2025-11", profit: 56, nonProfit: 104 },
    ]);
  });
  it("supports directly decoded responses and empty periods", () => {
    const data = { "7D": empty, "30D": empty, All: sample };
    expect(mapRatingTypeAnalytics(data, "7d")).toEqual({
      byRating: [],
      profitTrend: [],
    });
    expect(mapRatingTypeAnalytics(data, "30d")).toEqual({
      byRating: [],
      profitTrend: [],
    });
    expect(mapRatingTypeAnalytics(data, "all").byRating).toHaveLength(5);
  });
  it("joins sparse custom data by period without inventing observations", () => {
    const data = mapRatingTypeAnalytics({ Custom: custom }, "custom");
    expect(data.byRating.map((row) => row.organizations)).toEqual([
      0, 0, 0, 1, 3,
    ]);
    expect(data.profitTrend).toEqual([
      { period: "2026-01-25", profit: null, nonProfit: 19 },
      { period: "2026-01-29", profit: 8, nonProfit: null },
    ]);
  });
  it("rejects errors, malformed JSON and missing periods", () => {
    expect(() =>
      mapRatingTypeAnalytics({ statusCode: 400 }, "custom"),
    ).toThrow();
    expect(() => mapRatingTypeAnalytics({ body: "invalid" }, "1Y")).toThrow();
    expect(() => mapRatingTypeAnalytics({}, "1Y")).toThrow();
  });
});
