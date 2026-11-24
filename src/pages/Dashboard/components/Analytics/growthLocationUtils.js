import { isoAlpha3ToName } from "../../../../utils/isoCountryNames";

// The lambda returns `body` as a JSON string; tolerate an already-parsed object too.
export const unwrapBody = (response) => {
  if (!response) return null;
  const body = response.body ?? response;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
};

// "2026-01" → "Jan 2026", "2026-01-06" → "Jan 6, 2026"
export const formatPeriod = (periodStr) => {
  if (!periodStr) return "";
  const [year, month, day] = periodStr.split("-").map((n) => parseInt(n, 10));
  if (!year || !month) return periodStr;
  const date = new Date(year, month - 1, day || 1);
  return day
    ? date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// Merge growth_trend.total_organizations + collaborators into one recharts series
export const parseGrowthTrend = (growthTrend) => {
  if (!growthTrend) return [];
  const periodMap = {};
  const add = (arr, key) =>
    (Array.isArray(arr) ? arr : []).forEach(({ period, count }) => {
      if (!period) return;
      if (!periodMap[period]) periodMap[period] = { period };
      periodMap[period][key] = count;
    });
  add(growthTrend.total_organizations, "totalOrganizations");
  add(growthTrend.collaborators, "collaborators");
  return Object.values(periodMap)
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((item) => ({ ...item, label: formatPeriod(item.period) }));
};

// organizations_by_location → top-10 rows with country names and share %
export const parseLocation = (locationArr) => {
  if (!Array.isArray(locationArr) || locationArr.length === 0) return [];
  const total = locationArr.reduce((sum, { count }) => sum + (count || 0), 0);
  return locationArr
    .map(({ country, count }) => ({
      code: country,
      country: isoAlpha3ToName(country) || country,
      count,
      percentage: total ? Math.round((count / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};
