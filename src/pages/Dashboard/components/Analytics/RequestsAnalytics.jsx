import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import { getRequestsTrendAnalysis } from "../../../../services/analyticsServices";
import { isoAlpha3ToName } from "../../../../utils/isoCountryNames";
import requestsVolumeDataFallback from "../../../../data/analytics/requests_volume_monthly.json";
import requestsByCategoryRegionDataFallback from "../../../../data/analytics/requests_by_category_region_monthly.json";

// Trend response keys returned by the API for each time range.
// 7D / 30D / 1Y / All are all pre-computed windows returned by the {} payload.
// Custom is populated only when a custom date range payload is sent.
const TREND_KEYS = {
  "7d": "Requests count 7 days",
  "30d": "Requests count 30 days",
  "1yr": "Requests count 1 year",
  all: "Requests count all",
  custom: "Requests count custom date range",
};

// Category/region response keys per time range.
const CATEGORY_KEYS = {
  "7d": "Requests count by category and country 7 days",
  "30d": "Requests count by category and country 30 days",
  "1yr": "Requests count by category and country 1 year",
  all: "Requests count by category and country all",
  custom: "Requests count by category and country custom date range",
};

// Build a fetch payload for the given time range.
// Preset ranges (7D/30D/1Y/All) send {} — API returns all windows at once.
// Custom sends { start_date, end_date, group_by }.
// Returns null when custom is selected but dates aren't filled yet.
const buildFetchParams = (range, start, end, groupBy) => {
  if (range === "7d" || range === "30d" || range === "1yr" || range === "all")
    return {};
  if (range === "custom" && start && end)
    return { start_date: start, end_date: end, group_by: groupBy };
  return null;
};

// Normalize API trend items { Date, Count } → { date, count }
const normalizeItems = (arr) =>
  (arr ?? []).map((item) => ({
    date: (item.Date ?? "").split("T")[0],
    count: item.Count ?? 0,
  }));

// Parse category/region data from the API response.
// Input shape: { "Education": { "IND": [{Date, Count}, ..., {"Total Count": N}], ... }, ... }
// Output: [{ category, country, requestCount }, ...]
const parseCategoryData = (catObj) => {
  if (!catObj || typeof catObj !== "object" || Array.isArray(catObj)) return [];
  const rows = [];
  Object.entries(catObj).forEach(([category, countryMap]) => {
    if (!countryMap || typeof countryMap !== "object") return;
    Object.entries(countryMap).forEach(([isoCode, entries]) => {
      if (!Array.isArray(entries)) return;
      const summary = entries.find((e) => "Total Count" in e);
      const total = summary
        ? summary["Total Count"]
        : entries
            .filter((e) => "Date" in e)
            .reduce((sum, e) => sum + (e.Count ?? 0), 0);
      rows.push({
        category,
        country: isoAlpha3ToName(isoCode),
        requestCount: total,
      });
    });
  });
  return rows;
};

// Format a YYYY-MM-DD date string for display on the chart x-axis.
const formatDateLabel = (dateStr, range) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (range === "1yr" || range === "all") {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/**
 * RequestsAnalytics Component
 *
 * Displays:
 * 1. Request Volume Trend (Area Chart) — time range 7D / 30D / 1Y / All / Custom
 * 2. Requests by Category & Region (Stacked Bar Chart) — with category / country filters
 *
 * Both charts are driven by the POST /v1/ml/requestsTrendAnalysis API.
 * Preset ranges send {} and the API returns all windows at once.
 * Custom range sends { start_date, end_date, group_by } and shows a group_by selector.
 * Falls back to mock JSON on API error.
 */
const RequestsAnalytics = () => {
  const [timeRange, setTimeRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [customGroupBy, setCustomGroupBy] = useState("day");

  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("total");

  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [fetchParams, setFetchParams] = useState(() =>
    buildFetchParams("all", "", "", "day"),
  );

  // Update fetchParams whenever time range or custom inputs change.
  // Serialization guard prevents redundant fetches when switching preset ranges.
  useEffect(() => {
    const params = buildFetchParams(
      timeRange,
      customStartDate,
      customEndDate,
      customGroupBy,
    );
    if (params !== null) {
      setFetchParams((prev) =>
        JSON.stringify(prev) === JSON.stringify(params) ? prev : params,
      );
    }
  }, [timeRange, customStartDate, customEndDate, customGroupBy]);

  // Fetch from API whenever fetchParams changes.
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setApiLoading(true);
        const response = await getRequestsTrendAnalysis(fetchParams);
        if (!cancelled) {
          setApiData(response);
          setApiError(null);
        }
      } catch (error) {
        console.error("Failed to fetch requests analytics:", error);
        if (!cancelled) setApiError(error);
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [fetchParams]);

  // Build volume trend chart data from API response, fallback to mock.
  const volumeData = useMemo(() => {
    if (apiData) {
      const body = apiData.body ?? apiData;
      const key = TREND_KEYS[timeRange];
      const raw = normalizeItems(body[key]);
      if (raw.length > 0) {
        return raw.map((item, index) => {
          const prev = index > 0 ? raw[index - 1] : null;
          const percentChange = prev
            ? (((item.count - prev.count) / prev.count) * 100).toFixed(1)
            : "0.0";
          return {
            date: item.date,
            label: formatDateLabel(item.date, timeRange),
            requestCount: item.count,
            previousPeriod: prev ? prev.count : null,
            percentChange,
          };
        });
      }
    }
    // Fallback — mock data is monthly; reuse the existing shape.
    return requestsVolumeDataFallback.map((item, index, arr) => {
      const prev = index > 0 ? arr[index - 1] : null;
      const percentChange = prev
        ? (
            ((item.requestCount - prev.requestCount) / prev.requestCount) *
            100
          ).toFixed(1)
        : "0.0";
      const [year, month] = item.month.split("-");
      const d = new Date(parseInt(year), parseInt(month) - 1);
      return {
        date: item.month,
        label: d.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        requestCount: item.requestCount,
        previousPeriod: prev ? prev.requestCount : null,
        percentChange,
      };
    });
  }, [apiData, timeRange]);

  // Build category/region data from API response, fallback to mock.
  const categoryRegionData = useMemo(() => {
    if (apiData) {
      const body = apiData.body ?? apiData;
      const key = CATEGORY_KEYS[timeRange];
      const parsed = parseCategoryData(body[key]);
      if (parsed.length > 0) return parsed;
    }
    return requestsByCategoryRegionDataFallback;
  }, [apiData, timeRange]);

  // Compute top 5 countries by total request count.
  const top5Countries = useMemo(() => {
    const totals = {};
    categoryRegionData.forEach((item) => {
      totals[item.country] = (totals[item.country] || 0) + item.requestCount;
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, total]) => ({ country, total }));
  }, [categoryRegionData]);

  // Process stacked bar data for category & region chart.
  const processStackedData = useMemo(() => {
    const top5Names = top5Countries.map((c) => c.country);

    let filtered =
      selectedCategory === "all"
        ? categoryRegionData
        : categoryRegionData.filter(
            (item) => item.category === selectedCategory,
          );

    if (selectedCountry !== "all") {
      filtered = filtered.filter((item) => item.country === selectedCountry);
    }

    const categoryMap = {};
    filtered.forEach((item) => {
      if (!categoryMap[item.category])
        categoryMap[item.category] = { category: item.category };
      categoryMap[item.category][item.country] =
        (categoryMap[item.category][item.country] || 0) + item.requestCount;
    });

    let result = Object.values(categoryMap).map((item) => {
      const total = Object.keys(item)
        .filter((k) => k !== "category")
        .reduce((sum, k) => sum + (item[k] || 0), 0);
      return { ...item, total };
    });

    if (sortBy === "total") result.sort((a, b) => b.total - a.total);
    else result.sort((a, b) => a.category.localeCompare(b.category));

    const visibleCountries =
      selectedCountry !== "all" ? [selectedCountry] : top5Names;

    return { data: result, visibleCountries };
  }, [
    categoryRegionData,
    selectedCountry,
    selectedCategory,
    sortBy,
    top5Countries,
  ]);

  // Unique countries and categories for filter dropdowns.
  const countries = useMemo(
    () => [...new Set(categoryRegionData.map((item) => item.country))].sort(),
    [categoryRegionData],
  );

  const categories = useMemo(
    () => [...new Set(categoryRegionData.map((item) => item.category))].sort(),
    [categoryRegionData],
  );

  // Colors for stacked bars — dynamically assigned to the top 5 countries.
  const PALETTE = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
  ];
  const COUNTRY_COLORS = useMemo(() => {
    const map = {};
    top5Countries.forEach(({ country }, i) => {
      map[country] = PALETTE[i % PALETTE.length];
    });
    return map;
  }, [top5Countries]); // eslint-disable-line react-hooks/exhaustive-deps

  // Custom tooltip for volume trend chart.
  const CustomVolumeTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-800">{data.label}</p>
          <p className="text-sm text-blue-600">
            Current: {data.requestCount} requests
          </p>
          {data.previousPeriod && (
            <>
              <p className="text-sm text-gray-600">
                Previous: {data.previousPeriod} requests
              </p>
              <p
                className={`text-sm font-semibold ${
                  parseFloat(data.percentChange) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {parseFloat(data.percentChange) >= 0 ? "+" : ""}
                {data.percentChange}% change
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Chart 1: Request Volume Trend */}
      <ChartContainer title="Request Volume Trend" description="">
        {/* Time Range Selector */}
        <div className="flex gap-1.5 mb-2 flex-wrap items-center">
          {[
            { id: "7d", label: "7D" },
            { id: "30d", label: "30D" },
            { id: "1yr", label: "1Y" },
            { id: "all", label: "All" },
            { id: "custom", label: "Custom" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTimeRange(id)}
              className={`px-2 py-0.5 text-xs rounded ${
                timeRange === id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
          {timeRange === "custom" && (
            <>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
              <span className="text-xs text-gray-500">→</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
              <select
                value={customGroupBy}
                onChange={(e) => setCustomGroupBy(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              >
                <option value="day">Day</option>
                <option value="month">Month</option>
              </select>
            </>
          )}
        </div>

        {apiError && (
          <div className="mb-2 px-3 py-2 text-sm bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            Could not load live data from API. Showing fallback data.
          </div>
        )}

        {apiLoading ? (
          <div className="flex items-center justify-center h-52 text-gray-500 text-sm">
            Loading requests data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip content={<CustomVolumeTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="requestCount"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRequests)"
                name="Requests"
              />
              {volumeData.length > 1 && volumeData[1].previousPeriod && (
                <Area
                  type="monotone"
                  dataKey="previousPeriod"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  fillOpacity={0}
                  name="Previous Period"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* Chart 2: Requests by Category & Region (Stacked Bar) */}
      <ChartContainer
        title="Requests by Category & Region"
        description="Geographic distribution of requests across categories"
      >
        {/* Filters */}
        <div className="flex gap-2 mb-2 items-center flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-0.5 border border-gray-300 rounded text-xs"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-2 py-0.5 border border-gray-300 rounded text-xs"
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-0.5 border border-gray-300 rounded text-xs"
          >
            <option value="total">Sort: Total</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {/* Top 5 Countries */}
        <div className="mb-2 flex gap-1.5 flex-wrap items-center">
          <span className="text-xs font-semibold text-gray-500">Top 5:</span>
          {top5Countries.map(({ country, total }, index) => (
            <div
              key={country}
              className="flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs shadow-sm"
              style={{
                borderLeftWidth: "3px",
                borderLeftColor: COUNTRY_COLORS[country] || "#6b7280",
              }}
            >
              <span className="font-bold text-gray-400">#{index + 1}</span>
              <span className="font-medium text-gray-700">{country}</span>
              <span className="text-gray-400">({total})</span>
            </div>
          ))}
        </div>

        {apiLoading ? (
          <div className="flex items-center justify-center h-52 text-gray-500 text-sm">
            Loading requests data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={processStackedData.data}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
              />
              <Legend />
              {processStackedData.visibleCountries.map((country) => (
                <Bar
                  key={country}
                  dataKey={country}
                  stackId="a"
                  fill={COUNTRY_COLORS[country] || "#6b7280"}
                  radius={[0, 4, 4, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>
    </div>
  );
};

export default RequestsAnalytics;
