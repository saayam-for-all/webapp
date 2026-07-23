import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import {
  getKpiAnalytics,
  getVolunteerApplicationAnalytics,
  getBeneficiariesTrendAnalysis,
} from "../../../../services/analyticsServices";
import organizationOverviewMock from "../../../../data/analytics/organization_overview";

// Metrics available in the Organization Overview dropdown (Chart 1).
const METRIC_OPTIONS = [
  { id: "type", label: "Organizations by Type" },
  { id: "size", label: "Organizations by Size" },
  { id: "collaborator", label: "Collaborator Distribution" },
  { id: "contributor", label: "Contributor Distribution" },
  { id: "location", label: "Organizations by Location" },
  { id: "registrationTrend", label: "Organization Registration Trend" },
];

// Metrics available in the Organization Performance dropdown (Chart 2).
const METRIC_OPTIONS2 = [
  { id: "rating", label: "Average Organization Rating" },
  { id: "distribution", label: "Rating Distribution" },
  { id: "top-rating", label: "Top-Rated Organizations" },
  { id: "without-rating", label: "Organizations Without Ratings" },
  { id: "top-collaborator", label: "Top Collaborator Organizations" },
  { id: "top-contributor", label: "Top Contributor Organizations" },
  { id: "ratingandtype", label: "Organizations by Rating and Type" },
  { id: "ratingandsize", label: "Organizations by Rating and Size" },
];

const LOCATION_VIEWS = [
  { id: "state", label: "State" },
  { id: "city", label: "City" },
];

const TREND_GRANULARITIES = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

const BAR_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#6366f1",
  "#94a3b8",
];

const withColors = (items) =>
  (items ?? []).map((item, index) => ({
    ...item,
    fill: BAR_COLORS[index % BAR_COLORS.length],
  }));

// Monday-anchored week key so "weekly" buckets are stable regardless of
// which day of the week a given date falls on.
const getWeekStartKey = (date) => {
  const d = new Date(date);
  const dayNum = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
  d.setDate(d.getDate() - dayNum);
  return d.toISOString().slice(0, 10);
};

const formatBucketLabel = (key, granularity) => {
  if (granularity === "weekly") {
    const d = new Date(`${key}T00:00:00`);
    return `Wk of ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }
  if (granularity === "monthly") {
    const [year, month] = key.split("-");
    const d = new Date(parseInt(year), parseInt(month) - 1);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  if (granularity === "yearly") return key;
  // daily
  const d = new Date(`${key}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Aggregates the flat { date, count } activity trend into Daily / Weekly /
// Monthly / Yearly buckets. Daily is capped to the most recent 30 points so
// the chart stays readable.
const aggregateActivityTrend = (rawTrend, granularity) => {
  if (!Array.isArray(rawTrend) || rawTrend.length === 0) return [];

  if (granularity === "daily") {
    return rawTrend.slice(-30).map((item) => ({
      label: formatBucketLabel(item.date, "daily"),
      count: item.count,
    }));
  }

  const buckets = {};
  rawTrend.forEach(({ date, count }) => {
    let key;
    if (granularity === "weekly") key = getWeekStartKey(date);
    else if (granularity === "monthly") key = date.slice(0, 7);
    else key = date.slice(0, 4); // yearly
    buckets[key] = (buckets[key] ?? 0) + (count ?? 0);
  });

  return Object.keys(buckets)
    .sort()
    .map((key) => ({
      label: formatBucketLabel(key, granularity),
      count: buckets[key],
    }));
};

/**
 * OrganizationAnalytics Component (Dashboard tab)
 *
 * Displays:
 * 1. Organization Overview — controlled by independent states and options 1.
 * 2. Organization Performance — controlled by independent states and options 2 (Ratings).
 */
const OrganizationAnalytics = () => {
  // Chart 1 States
  const [selectedMetric1, setSelectedMetric1] = useState("type");
  const [locationView1, setLocationView1] = useState("state");
  const [trendGranularity1, setTrendGranularity1] = useState("monthly");

  // Chart 2 States (Independent)
  const [selectedMetric2, setSelectedMetric2] = useState("rating");

  const [kpiData, setKpiData] = useState(null);
  const [volunteerData, setVolunteerData] = useState(null);
  const [beneficiaryData, setBeneficiaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      setLoading(true);
      const [kpiResult, volunteerResult, beneficiaryResult] =
        await Promise.allSettled([
          getKpiAnalytics(),
          getVolunteerApplicationAnalytics({}),
          getBeneficiariesTrendAnalysis({}),
        ]);
      if (cancelled) return;

      if (kpiResult.status === "fulfilled") setKpiData(kpiResult.value);
      if (volunteerResult.status === "fulfilled")
        setVolunteerData(volunteerResult.value);
      if (beneficiaryResult.status === "fulfilled")
        setBeneficiaryData(beneficiaryResult.value);

      const allFailed =
        kpiResult.status === "rejected" &&
        volunteerResult.status === "rejected" &&
        beneficiaryResult.status === "rejected";
      setHasError(allFailed);
      setLoading(false);
    };
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const overviewSummary = organizationOverviewMock.summary;

  // Data for Chart 1: Organization Overview
  const chart1Data = useMemo(() => {
    switch (selectedMetric1) {
      case "type":
        return withColors(organizationOverviewMock.organizations_by_type);
      case "size":
        return withColors(organizationOverviewMock.organizations_by_size);
      case "collaborator":
        return withColors(organizationOverviewMock.collaborator_distribution);
      case "contributor":
        return withColors(organizationOverviewMock.contributor_distribution);
      case "location":
        return withColors(
          organizationOverviewMock.organizations_by_location?.[locationView1] ??
            [],
        );
      case "registrationTrend":
        return aggregateActivityTrend(
          organizationOverviewMock.organization_activity_trend,
          trendGranularity1,
        );
      default:
        return [];
    }
  }, [selectedMetric1, locationView1, trendGranularity1]);

  // Data for Chart 2: Organization Performance / Ratings
  const chart2Data = useMemo(() => {
    const ratings = organizationOverviewMock.Organization_Ratings ?? [];

    if (selectedMetric2 === "rating") {
      return ratings
        .filter((item) => item.rating !== null && item.rating !== undefined)
        .map((item, index) => {
          const shortName = item.name
            ? item.name.replace(/[^0-9]/g, "")
            : String(index + 1);
          return {
            name: "",
            count: item.rating,
            fill: BAR_COLORS[index % BAR_COLORS.length],
          };
        });
    }

    if (
      selectedMetric2 === "distribution" ||
      selectedMetric2 === "ratingandtype"
    ) {
      const ranges = [
        { name: "1 - 2", min: 1, max: 2, profit: 0, nonProfit: 0, count: 0 },
        { name: "2 - 3", min: 2, max: 3, profit: 0, nonProfit: 0, count: 0 },
        { name: "3 - 4", min: 3, max: 4, profit: 0, nonProfit: 0, count: 0 },
        { name: "4 - 5", min: 4, max: 5, profit: 0, nonProfit: 0, count: 0 },
      ];

      ratings.forEach((item) => {
        const r = item.rating;
        if (r != null) {
          let rangeIndex = -1;
          if (r >= 1 && r < 2) rangeIndex = 0;
          else if (r >= 2 && r < 3) rangeIndex = 1;
          else if (r >= 3 && r < 4) rangeIndex = 2;
          else if (r >= 4 && r <= 5) rangeIndex = 3;

          if (rangeIndex !== -1) {
            ranges[rangeIndex].count++;
            if (item.type === "profit") {
              ranges[rangeIndex].profit++;
            } else if (item.type === "non-profit") {
              ranges[rangeIndex].nonProfit++;
            }
          }
        }
      });

      return ranges;
    }

    if (selectedMetric2 === "ratingandsize") {
      const ranges = [
        { name: "1 - 2", min: 1, max: 2, totalSize: 0, count: 0 },
        { name: "2 - 3", min: 2, max: 3, totalSize: 0, count: 0 },
        { name: "3 - 4", min: 3, max: 4, totalSize: 0, count: 0 },
        { name: "4 - 5", min: 4, max: 5, totalSize: 0, count: 0 },
      ];

      ratings.forEach((item) => {
        const r = item.rating;
        const s = item.size ?? 0;
        if (r != null) {
          let rangeIndex = -1;
          if (r >= 1 && r < 2) rangeIndex = 0;
          else if (r >= 2 && r < 3) rangeIndex = 1;
          else if (r >= 3 && r < 4) rangeIndex = 2;
          else if (r >= 4 && r <= 5) rangeIndex = 3;

          if (rangeIndex !== -1) {
            ranges[rangeIndex].count++;
            ranges[rangeIndex].totalSize += s;
          }
        }
      });

      return ranges.map((range, index) => ({
        name: range.name,
        count: range.count,
        avgSize:
          range.count > 0 ? Math.round(range.totalSize / range.count) : 0,
        fill: BAR_COLORS[index % BAR_COLORS.length],
      }));
    }

    if (selectedMetric2 === "top-rating") {
      let highRatingCount = 0; // 4 or more
      let lowRatingCount = 0; // Below 4

      ratings.forEach((item) => {
        if (item.rating !== null && item.rating !== undefined) {
          if (item.rating >= 4) {
            highRatingCount++;
          } else {
            lowRatingCount++;
          }
        }
      });

      return [
        { name: "4+ Rating", count: highRatingCount, fill: "#10b981" },
        { name: "Below 4 Rating", count: lowRatingCount, fill: "#f59e0b" },
      ];
    }

    if (selectedMetric2 === "without-rating") {
      let ratedCount = 0;
      let nullCount = 0;

      ratings.forEach((item) => {
        if (item.rating !== null && item.rating !== undefined) {
          ratedCount++;
        } else {
          nullCount++;
        }
      });

      return [
        { name: "With Ratings", count: ratedCount, fill: "#3b82f6" },
        { name: "Without Ratings", count: nullCount, fill: "#94a3b8" },
      ];
    }

    if (selectedMetric2 === "top-collaborator") {
      const topCollabData = organizationOverviewMock
        .top_collobrator_organizations?.[0] ?? {
        collaborator: 0,
        non_collaborator: 0,
      };

      return [
        {
          name: "Collaborator",
          count: topCollabData.collaborator,
          fill: "#3b82f6",
        },
        {
          name: "Non-Collaborator",
          count: topCollabData.non_collaborator,
          fill: "#f59e0b",
        },
      ];
    }

    if (selectedMetric2 === "top-contributor") {
      const topContribData = organizationOverviewMock
        .top_contributor_organizations?.[0] ?? {
        contributor: 0,
        non_contributor: 0,
      };

      return [
        {
          name: "Contributor",
          count: topContribData.contributor,
          fill: "#10b981",
        },
        {
          name: "Non-Contributor",
          count: topContribData.non_contributor,
          fill: "#f59e0b",
        },
      ];
    }

    return [];
  }, [selectedMetric2]);

  const isLocationMetric1 = selectedMetric1 === "location";
  const isTrendMetric1 = selectedMetric1 === "registrationTrend";
  const isStackedRatingType = selectedMetric2 === "ratingandtype";
  const isRatingAndSize = selectedMetric2 === "ratingandsize";
  const isTopCollaborator = selectedMetric2 === "top-collaborator";
  const isTopContributor = selectedMetric2 === "top-contributor";

  // Dynamic description text for Chart 2 header card
  const getChart2Description = () => {
    if (isTopCollaborator) {
      const total =
        organizationOverviewMock.top_collobrator_organizations?.[0]?.total ??
        overviewSummary.total_organizations;
      return `Total Organizations: ${total}`;
    }
    if (isTopContributor) {
      const total =
        organizationOverviewMock.top_contributor_organizations?.[0]?.total ??
        overviewSummary.total_organizations;
      return `Total Organizations: ${total}`;
    }
    return `Total Organizations: ${overviewSummary.total_organizations}`;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Chart 1: Organization Overview */}
      <ChartContainer
        title="Organization Overview"
        description={`Total Organizations: ${overviewSummary.total_organizations}`}
      >
        <div className="mb-2 flex gap-2 items-center flex-wrap">
          <select
            value={selectedMetric1}
            onChange={(e) => setSelectedMetric1(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white"
            aria-label="Select organization metric"
          >
            {METRIC_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          {isLocationMetric1 && (
            <div className="flex gap-1">
              {LOCATION_VIEWS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLocationView1(id)}
                  className={`px-2 py-0.5 text-xs rounded ${
                    locationView1 === id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {isTrendMetric1 && (
            <div className="flex gap-1">
              {TREND_GRANULARITIES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTrendGranularity1(id)}
                  className={`px-2 py-0.5 text-xs rounded ${
                    trendGranularity1 === id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {chart1Data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No data available.
          </div>
        ) : isTrendMetric1 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={chart1Data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
                activeDot={{ r: 5 }}
                name="New Registrations"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chart1Data}
              layout={isLocationMetric1 ? "vertical" : "horizontal"}
              margin={
                isLocationMetric1
                  ? { left: 20 }
                  : { top: 5, right: 20, left: 0, bottom: 5 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              {isLocationMetric1 ? (
                <>
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    width={110}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    allowDecimals={false}
                  />
                </>
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
              />
              <Bar
                dataKey="count"
                name="Organizations"
                radius={isLocationMetric1 ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              >
                {chart1Data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* Chart 2: Organization Performance */}
      <ChartContainer
        title="Organization Performance"
        description={getChart2Description()}
      >
        <div className="mb-2 flex gap-2 items-center flex-wrap">
          <select
            value={selectedMetric2}
            onChange={(e) => setSelectedMetric2(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white"
            aria-label="Select organization performance metric"
          >
            {METRIC_OPTIONS2.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {chart2Data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No data available.
          </div>
        ) : selectedMetric2 === "without-rating" ||
          isTopCollaborator ||
          isTopContributor ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Pie
                data={chart2Data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {chart2Data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : isStackedRatingType ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chart2Data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                stroke="#6b7280"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="profit" name="Profit" stackId="a" fill="#3b82f6" />
              <Bar
                dataKey="nonProfit"
                name="Non-Profit"
                stackId="a"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chart2Data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                stroke="#6b7280"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
                allowDecimals={selectedMetric2 === "rating"}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
                formatter={(value, name, item) => {
                  if (isRatingAndSize) {
                    return [
                      <div key="tooltip-content">
                        <div>Organizations: {value}</div>
                        <div>Average Size: {item.payload.avgSize}</div>
                      </div>,
                      "",
                    ];
                  }
                  return [value, name];
                }}
              />
              <Bar
                dataKey="count"
                name={isRatingAndSize ? "Organizations Count" : "Rating"}
                radius={[4, 4, 0, 0]}
              >
                {chart2Data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>
    </div>
  );
};

export default OrganizationAnalytics;
