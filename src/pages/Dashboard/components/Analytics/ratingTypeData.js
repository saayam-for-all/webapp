const PERIOD_KEYS = {
  "7d": "7D",
  "30d": "30D",
  "1Y": "1Y",
  all: "All",
  custom: "Custom",
};

export const getRatingTypePayload = (
  dateRange,
  startDate = "",
  endDate = "",
  country,
) => {
  if (!Object.hasOwn(PERIOD_KEYS, dateRange)) {
    throw new Error("Unsupported date range");
  }
  const payload = {};
  if (country) payload.country = country;
  if (dateRange === "custom") {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
      startDate > endDate
    ) {
      throw new Error("Select a valid start and end date");
    }
    payload.start_date = startDate;
    payload.end_date = endDate;
  }
  return payload;
};

const decodeResponse = (response) => {
  if (response?.statusCode >= 400) {
    throw new Error("Rating and type analytics request failed");
  }
  const body = response?.body ?? response;
  const data = typeof body === "string" ? JSON.parse(body) : body;
  if (!data || typeof data !== "object" || data.error) {
    throw new Error("Invalid rating and type analytics response");
  }
  return data;
};

const isCount = (value) => Number.isInteger(value) && value >= 0;

const toPeriodMap = (rows) => {
  if (!Array.isArray(rows)) throw new Error("Invalid organization mix trend");
  const map = new Map();
  for (const { period, count } of rows) {
    if (
      typeof period !== "string" ||
      !/^\d{4}-\d{2}(-\d{2})?$/.test(period) ||
      !isCount(count) ||
      map.has(period)
    ) {
      throw new Error("Invalid organization mix trend row");
    }
    map.set(period, count);
  }
  return map;
};

export const mapRatingTypeAnalytics = (response, dateRange) => {
  const period = decodeResponse(response)[PERIOD_KEYS[dateRange]];
  const distribution = period?.rating_distribution;
  const trend = period?.organization_mix_trend;
  if (!Array.isArray(distribution) || !trend) {
    throw new Error("Missing rating and type analytics period");
  }

  const ratings = new Map();
  for (const { rating, count } of distribution) {
    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      !isCount(count) ||
      ratings.has(rating)
    ) {
      throw new Error("Invalid rating distribution row");
    }
    ratings.set(rating, count);
  }
  // Retain the five star buckets when ratings exist, including omitted buckets.
  const byRating = distribution.length
    ? [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        organizations: ratings.get(rating) ?? 0,
      }))
    : [];

  const profit = toPeriodMap(trend.for_profit);
  const nonProfit = toPeriodMap(trend.non_profit);
  const periods = [...new Set([...profit.keys(), ...nonProfit.keys()])].sort();
  // Missing observations are unknown, not zero. Preserve the reported values.
  const profitTrend = periods.map((key) => ({
    period: key,
    profit: profit.get(key) ?? null,
    nonProfit: nonProfit.get(key) ?? null,
  }));
  return { byRating, profitTrend };
};
