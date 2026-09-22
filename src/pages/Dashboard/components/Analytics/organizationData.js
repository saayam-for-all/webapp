/**
 * Indicative organization analytics data.
 *
 * There is no organization analytics API endpoint yet. Until one exists this
 * module is the single source of truth for the Organization dashboard, so
 * swapping in a real service later is a one-file change: keep the shapes
 * returned by `getOrganizationAnalytics` and the charts keep working.
 */

// Chart palette — validated for colour-vision deficiency separation and
// contrast against the light chart surface (see ORG_SERIES usage in
// OrganizationAnalytics). Blue/green/violet clear every check on all pairs.
export const ORG_SERIES = {
  total: "#3b82f6", // blue
  active: "#059669", // green
  collaborator: "#4a3aa7", // violet
  other: "#9ca3af", // neutral — the "Other" bucket, never a series
};

// Single-hue sequential ramp for the ordinal rating scale (1 → 5 stars).
export const RATING_RAMP = [
  "#aca3dc",
  "#9083cd",
  "#7264bd",
  "#5847b0",
  "#3f3199",
];

// Star glyph colours in the rating axis labels — decorative, paired with text.
export const RATING_STAR_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#86efac",
  "#22c55e",
];

export const DATE_RANGES = [
  { id: "7d", label: "Last 7 Days", days: 7 },
  { id: "30d", label: "Last 30 Days", days: 30 },
  { id: "12m", label: "Last 12 Months", months: 12 },
  { id: "all", label: "All Time", months: 12 },
];

export const REGIONS = ["All", "North", "South", "East", "West"];

export const ORG_TYPES = ["All", "Profit", "Non-Profit"];

// Daily data for the last 30 days (Jun 1-30, 2025)
const DAILY_DATA = [
  { date: "2025-06-01", total: 121, active: 87, collaborator: 31, profit: 45 },
  { date: "2025-06-02", total: 122, active: 88, collaborator: 31, profit: 46 },
  { date: "2025-06-03", total: 123, active: 88, collaborator: 32, profit: 46 },
  { date: "2025-06-04", total: 124, active: 89, collaborator: 32, profit: 47 },
  { date: "2025-06-05", total: 125, active: 90, collaborator: 32, profit: 47 },
  { date: "2025-06-06", total: 126, active: 91, collaborator: 32, profit: 48 },
  { date: "2025-06-07", total: 127, active: 91, collaborator: 33, profit: 48 },
  { date: "2025-06-08", total: 128, active: 92, collaborator: 33, profit: 48 },
  { date: "2025-06-09", total: 128, active: 92, collaborator: 33, profit: 48 },
  { date: "2025-06-10", total: 129, active: 93, collaborator: 33, profit: 49 },
  { date: "2025-06-11", total: 130, active: 93, collaborator: 34, profit: 49 },
  { date: "2025-06-12", total: 131, active: 94, collaborator: 34, profit: 49 },
  { date: "2025-06-13", total: 131, active: 94, collaborator: 34, profit: 49 },
  { date: "2025-06-14", total: 131, active: 94, collaborator: 34, profit: 49 },
  { date: "2025-06-15", total: 132, active: 95, collaborator: 34, profit: 50 },
  { date: "2025-06-16", total: 132, active: 95, collaborator: 35, profit: 50 },
  { date: "2025-06-17", total: 132, active: 95, collaborator: 35, profit: 50 },
  { date: "2025-06-18", total: 133, active: 96, collaborator: 35, profit: 50 },
  { date: "2025-06-19", total: 133, active: 96, collaborator: 35, profit: 51 },
  { date: "2025-06-20", total: 134, active: 97, collaborator: 35, profit: 51 },
  { date: "2025-06-21", total: 134, active: 97, collaborator: 35, profit: 51 },
  { date: "2025-06-22", total: 135, active: 97, collaborator: 36, profit: 51 },
  { date: "2025-06-23", total: 135, active: 98, collaborator: 36, profit: 52 },
  { date: "2025-06-24", total: 136, active: 98, collaborator: 36, profit: 52 },
  { date: "2025-06-25", total: 137, active: 99, collaborator: 36, profit: 52 },
  { date: "2025-06-26", total: 138, active: 99, collaborator: 37, profit: 52 },
  { date: "2025-06-27", total: 138, active: 99, collaborator: 37, profit: 53 },
  { date: "2025-06-28", total: 139, active: 100, collaborator: 37, profit: 53 },
  { date: "2025-06-29", total: 129, active: 94, collaborator: 33, profit: 48 },
  { date: "2025-06-30", total: 129, active: 94, collaborator: 33, profit: 48 },
];

// Month-by-month series. Region and type mixes below are derived from these
// totals so every filter combination stays internally consistent.
const MONTHLY = [
  { month: "Jul '24", total: 78, active: 55, collaborator: 21, profit: 32 },
  { month: "Aug '24", total: 91, active: 64, collaborator: 24, profit: 34 },
  { month: "Sep '24", total: 101, active: 71, collaborator: 26, profit: 36 },
  { month: "Oct '24", total: 105, active: 74, collaborator: 26, profit: 37 },
  { month: "Nov '24", total: 104, active: 76, collaborator: 25, profit: 38 },
  { month: "Dec '24", total: 110, active: 80, collaborator: 28, profit: 39 },
  { month: "Jan '25", total: 116, active: 83, collaborator: 28, profit: 41 },
  { month: "Feb '25", total: 115, active: 84, collaborator: 28, profit: 42 },
  { month: "Mar '25", total: 112, active: 83, collaborator: 28, profit: 43 },
  { month: "Apr '25", total: 118, active: 86, collaborator: 30, profit: 45 },
  { month: "May '25", total: 121, active: 88, collaborator: 32, profit: 46 },
  { month: "Jun '25", total: 129, active: 94, collaborator: 33, profit: 48 },
];

// Share of the org population that each region holds. Used to scale every
// metric when a single region is selected.
const REGION_SHARE = {
  All: 1,
  North: 0.32,
  South: 0.25,
  East: 0.19,
  West: 0.24,
};

// Locations rolled up per region, so the location bar chart responds to the
// region filter instead of showing the same five rows every time.
const LOCATIONS_BY_REGION = {
  North: [
    { location: "Illinois", organizations: 12 },
    { location: "New York", organizations: 18 },
    { location: "Other", organizations: 10 },
  ],
  South: [
    { location: "Texas", organizations: 24 },
    { location: "Georgia", organizations: 10 },
    { location: "Other", organizations: 8 },
  ],
  East: [
    { location: "New York", organizations: 11 },
    { location: "Other", organizations: 6 },
  ],
  West: [
    { location: "California", organizations: 32 },
    { location: "Other", organizations: 6 },
  ],
};

const TOTAL_ORGS = 126;

const round = (n) => Math.max(0, Math.round(n));

const scaleFactor = (region, orgType) => {
  const regionFactor = REGION_SHARE[region] ?? 1;
  // Profit orgs are 48/126 of the population at the end of the window.
  const typeFactor =
    orgType === "Profit"
      ? 48 / TOTAL_ORGS
      : orgType === "Non-Profit"
        ? 1 - 48 / TOTAL_ORGS
        : 1;
  return regionFactor * typeFactor;
};

/**
 * Parse date string (YYYY-MM-DD format) and return Date object
 */
const parseDate = (dateStr) => {
  const parts = dateStr.split("-");
  return new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2]),
  );
};

/**
 * Filter data within a date range
 */
const filterDataByDateRange = (data, startDate, endDate) => {
  if (!startDate || !endDate) return data;

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  return data.filter((item) => {
    const itemDate = parseDate(item.date || item.month);
    return itemDate >= start && itemDate <= end;
  });
};

/**
 * Returns every dataset the Organization dashboard renders, filtered by the
 * supplied date range / region / org type.
 */
export const getOrganizationAnalytics = ({
  dateRange = "12m",
  region = "All",
  orgType = "All",
  customStartDate = "",
  customEndDate = "",
} = {}) => {
  const factor = scaleFactor(region, orgType);

  let window = [];
  let isDaily = false;

  // Select data based on date range
  if (dateRange === "7d") {
    // Last 7 days of daily data
    window = DAILY_DATA.slice(-7);
    isDaily = true;
  } else if (dateRange === "30d") {
    // Last 30 days of daily data
    window = DAILY_DATA;
    isDaily = true;
  } else if (dateRange === "custom" && customStartDate && customEndDate) {
    // Custom date range
    const filtered = filterDataByDateRange(
      DAILY_DATA,
      customStartDate,
      customEndDate,
    );
    window = filtered.length > 0 ? filtered : DAILY_DATA;
    isDaily = true;
  } else {
    // Monthly data for 12m or all
    window = MONTHLY;
    isDaily = false;
  }

  // Format growth trend data
  const growthTrend = window.map((m) => ({
    [isDaily ? "date" : "month"]: isDaily ? m.date : m.month,
    total: round(m.total * factor),
    active: round(m.active * factor),
    collaborator: round(m.collaborator * factor),
  }));

  // Format profit trend data
  const profitTrend = window.map((m) => ({
    [isDaily ? "date" : "month"]: isDaily ? m.date : m.month,
    profit:
      orgType === "Non-Profit"
        ? 0
        : round(m.profit * (REGION_SHARE[region] ?? 1)),
    nonProfit:
      orgType === "Profit"
        ? 0
        : round((m.total - m.profit) * (REGION_SHARE[region] ?? 1)),
  }));

  const latest = growthTrend[growthTrend.length - 1] ?? {
    total: 0,
    active: 0,
    collaborator: 0,
  };
  const first = growthTrend[0] ?? latest;

  const pctChange = (now, then) =>
    then > 0 ? Math.round(((now - then) / then) * 100) : 0;

  const kpis = {
    totalOrganizations: latest.total,
    activeOrganizations: latest.active,
    collaboratorOrgs: latest.collaborator,
    avgRating: 4.2,
    change: {
      totalOrganizations: pctChange(latest.total, first.total),
      activeOrganizations: pctChange(latest.active, first.active),
      collaboratorOrgs: pctChange(latest.collaborator, first.collaborator),
      avgRating: 4,
    },
  };

  // Locations: the selected region's rows, or every region rolled up.
  const rawLocations =
    region === "All"
      ? Object.values(LOCATIONS_BY_REGION)
          .flat()
          .reduce((acc, row) => {
            const existing = acc.find((a) => a.location === row.location);
            if (existing) existing.organizations += row.organizations;
            else acc.push({ ...row });
            return acc;
          }, [])
      : LOCATIONS_BY_REGION[region].map((row) => ({ ...row }));

  const typeFactor =
    orgType === "All" ? 1 : factor / (REGION_SHARE[region] ?? 1);
  const scaledLocations = rawLocations.map((row) => ({
    ...row,
    organizations: round(row.organizations * typeFactor),
  }));
  const locationTotal = scaledLocations.reduce(
    (sum, row) => sum + row.organizations,
    0,
  );

  // "Other" always sorts last; the named rows sort by size.
  const byLocation = scaledLocations
    .sort((a, b) => {
      if (a.location === "Other") return 1;
      if (b.location === "Other") return -1;
      return b.organizations - a.organizations;
    })
    .map((row) => ({
      ...row,
      percent:
        locationTotal > 0
          ? Number(((row.organizations / locationTotal) * 100).toFixed(1))
          : 0,
    }));

  const bySize = [
    { size: "Small", organizations: round(50 * factor) },
    { size: "Medium", organizations: round(45 * factor) },
    { size: "Large", organizations: round(31 * factor) },
  ];

  const collaboratorSplit = [
    { name: "Collaborator", value: latest.collaborator },
    {
      name: "Contributor (Non-Collaborator)",
      value: Math.max(0, latest.total - latest.collaborator),
    },
  ];

  const byRating = [
    { rating: "1 Star", stars: 1, organizations: round(1 * factor) },
    { rating: "2 Stars", stars: 2, organizations: round(3 * factor) },
    { rating: "3 Stars", stars: 3, organizations: round(12 * factor) },
    { rating: "4 Stars", stars: 4, organizations: round(46 * factor) },
    { rating: "5 Stars", stars: 5, organizations: round(64 * factor) },
  ];

  return {
    kpis,
    growthTrend,
    byLocation,
    bySize,
    collaboratorSplit,
    byRating,
    profitTrend,
    asOf: "Jun 30, 2025",
  };
};
