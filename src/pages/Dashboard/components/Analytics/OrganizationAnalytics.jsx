import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

// Metrics available in the Organization Overview dropdown.
const METRIC_OPTIONS = [
  { id: "type", label: "Organizations by Type" },
  { id: "size", label: "Organizations by Size" },
  { id: "collaborator", label: "Collaborator Distribution" },
  { id: "contributor", label: "Contributor Distribution" },
  { id: "location", label: "Organizations by Location" },
  { id: "registrationTrend", label: "Organization Registration Trend" },
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

// Format "2026-01" -> "Jan 2026"
const formatMonthLabel = (yyyyMM) => {
  if (!yyyyMM) return "";
  const [year, month] = yyyyMM.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// KPI "1Y" bucket: total_requests is an array of { period, total_requests }
const parseRequestsByMonth = (kpiData) => {
  const body = kpiData?.body ?? kpiData;
  const series = body?.["1Y"]?.total_requests;
  const map = {};
  if (Array.isArray(series)) {
    series.forEach(({ period, total_requests }) => {
      const key = period?.slice(0, 7);
      if (key) map[key] = total_requests ?? 0;
    });
  }
  return map;
};

// Volunteer "1Y" bucket: volunteer_activity_trend.total_volunteers is an array of { period, count }
const parseVolunteersByMonth = (volunteerData) => {
  const body = volunteerData?.body ?? volunteerData;
  const series = body?.["1Y"]?.volunteer_activity_trend?.total_volunteers;
  const map = {};
  if (Array.isArray(series)) {
    series.forEach(({ period, count }) => {
      if (period) map[period] = count ?? 0;
    });
  }
  return map;
};

// Beneficiaries "Beneficiaries count 1 year" bucket: array of { Date, Count }
const parseBeneficiariesByMonth = (beneficiaryData) => {
  const body = beneficiaryData?.body ?? beneficiaryData;
  const series = body?.["Beneficiaries count 1 year"];
  const map = {};
  if (Array.isArray(series)) {
    series.forEach(({ Date: dateStr, Count }) => {
      const key = dateStr?.split("T")[0]?.slice(0, 7);
      if (key) map[key] = (map[key] ?? 0) + (Count ?? 0);
    });
  }
  return map;
};

/**
 * OrganizationAnalytics Component (Dashboard tab)
 *
 * Displays:
 * 1. Organization Overview — a metric dropdown (Type, Size, Collaborator/Contributor
 *    Distribution, Location, Registration Trend) driving a single chart, backed by
 *    mock data shaped like the documented `organization_overview` API response.
 * 2. Organization Performance — a 12-month trend combining request volume,
 *    volunteer growth, and beneficiary growth on a single chart.
 */
const OrganizationAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState("type");
  const [locationView, setLocationView] = useState("state");
  const [trendGranularity, setTrendGranularity] = useState("monthly");

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

  const overviewChartData = useMemo(() => {
    switch (selectedMetric) {
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
          organizationOverviewMock.organizations_by_location?.[locationView] ??
            [],
        );
      case "registrationTrend":
        return aggregateActivityTrend(
          organizationOverviewMock.organization_activity_trend,
          trendGranularity,
        );
      default:
        return [];
    }
  }, [selectedMetric, locationView, trendGranularity]);

  const performanceData = useMemo(() => {
    const requestsByMonth = parseRequestsByMonth(kpiData);
    const volunteersByMonth = parseVolunteersByMonth(volunteerData);
    const beneficiariesByMonth = parseBeneficiariesByMonth(beneficiaryData);

    const allMonths = new Set([
      ...Object.keys(requestsByMonth),
      ...Object.keys(volunteersByMonth),
      ...Object.keys(beneficiariesByMonth),
    ]);

    return [...allMonths].sort().map((month) => ({
      month,
      label: formatMonthLabel(month),
      requests: requestsByMonth[month] ?? 0,
      volunteers: volunteersByMonth[month] ?? 0,
      beneficiaries: beneficiariesByMonth[month] ?? 0,
    }));
  }, [kpiData, volunteerData, beneficiaryData]);

  const isLocationMetric = selectedMetric === "location";
  const isTrendMetric = selectedMetric === "registrationTrend";

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Chart 1: Organization Overview */}
      <ChartContainer
        title="Organization Overview"
        description={`Total Organizations: ${overviewSummary.total_organizations}`}
      >
        <div className="mb-2 flex gap-2 items-center flex-wrap">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white"
            aria-label="Select organization metric"
          >
            {METRIC_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          {isLocationMetric && (
            <div className="flex gap-1">
              {LOCATION_VIEWS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLocationView(id)}
                  className={`px-2 py-0.5 text-xs rounded ${
                    locationView === id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {isTrendMetric && (
            <div className="flex gap-1">
              {TREND_GRANULARITIES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTrendGranularity(id)}
                  className={`px-2 py-0.5 text-xs rounded ${
                    trendGranularity === id
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

        {overviewChartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No data available.
          </div>
        ) : isTrendMetric ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={overviewChartData}
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
              data={overviewChartData}
              layout={isLocationMetric ? "vertical" : "horizontal"}
              margin={
                isLocationMetric
                  ? { left: 20 }
                  : { top: 5, right: 20, left: 0, bottom: 5 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              {isLocationMetric ? (
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
                radius={isLocationMetric ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              >
                {overviewChartData.map((entry) => (
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
        description="12-month trend of requests, volunteers, and beneficiaries"
      >
        {hasError && (
          <div className="mb-2 px-3 py-2 text-sm bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            Could not load organization data. Please try again later.
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
            Loading performance data...
          </div>
        ) : performanceData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No trend data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={performanceData}
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
              <Legend />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
                activeDot={{ r: 5 }}
                name="Requests"
              />
              <Line
                type="monotone"
                dataKey="volunteers"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
                activeDot={{ r: 5 }}
                name="Volunteers"
              />
              <Line
                type="monotone"
                dataKey="beneficiaries"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", r: 3 }}
                activeDot={{ r: 5 }}
                name="Beneficiaries"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>
    </div>
  );
};

export default OrganizationAnalytics;
