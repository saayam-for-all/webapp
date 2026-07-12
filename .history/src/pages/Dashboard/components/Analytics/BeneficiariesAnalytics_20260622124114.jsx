import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import ChartContainer from "./charts/ChartContainer";
import { getBeneficiariesTrendAnalysis } from "../../../../services/analyticsServices";
import beneficiariesGrowthDataFallback from "../../../../data/analytics/beneficiaries_growth_monthly.json";
import beneficiariesByCountryDataFallback from "../../../../data/analytics/beneficiaries_by_country_monthly.json";

// World map GeoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Compute a date string relative to today
const getRelativeDate = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
};

// Earliest date requested for the "All" range so the API returns the full history
const ALL_TIME_START_DATE = "2000-01-01";

// Trend response keys returned by the API (from the real response format)
const BENEFICIARY_TREND_KEYS = {
  "7d": "Beneficiaries count 7 days",
  "30d": "Beneficiaries count 1 month",
  "1yr": "Beneficiaries count 1 year",
  custom: "Beneficiaries count custom date range",
  all: "Beneficiaries count custom date range",
};

// Country response keys — each is an object keyed by ISO alpha-3 country code,
// with an array of { Date, Count } entries per country.
const COUNTRY_DATA_KEYS = {
  "7d": "Beneficiaries count by country 7 days",
  "30d": "Beneficiaries count by country 1 month",
  "1yr": "Beneficiaries count by country 1 year",
  custom: "Beneficiaries count by country custom date range",
  all: "Beneficiaries count by country custom date range",
};

// Build a fetch payload for the given time range and optional date/group_by params.
// 7D / 30D / 1Y send {} so the API returns all three pre-computed windows at once.
// All and Custom send an explicit date range with a group_by granularity.
// Returns null when a custom/country range is selected but both dates aren't filled yet.
const buildFetchParams = (range, start, end, groupBy) => {
  if (range === "7d" || range === "30d" || range === "1yr") return {};
  if (range === "all") {
    return {
      beneficiaries_start_date: ALL_TIME_START_DATE,
      beneficiaries_end_date: getRelativeDate(0),
      beneficiaries_group_by: "month",
    };
  }
  if (range === "custom" && start && end) {
    return {
      beneficiaries_start_date: start,
      beneficiaries_end_date: end,
      beneficiaries_group_by: groupBy,
    };
  }
  return null;
};

// Normalize API items { Date, Count } → { date, count }
const normalizeItems = (arr) =>
  (arr ?? []).map((item) => ({
    date: (item.Date ?? "").split("T")[0],
    count: item.Count ?? 0,
  }));

// Resolve an ISO 3166-1 alpha-3 country code to a readable English name.
// Uses Intl.DisplayNames (supported in all modern browsers and Node ≥ 13).
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const isoToCountryName = (code) => {
  if (!code) return "";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
};

// Aggregate the per-country object returned by the API into a flat array.
// Input:  { "AFG": [{Date, Count}, ...], "USA": [...] }
// Output: [{ month, country, beneficiaryCount }, ...]
const parseCountryData = (countryObj) => {
  if (
    !countryObj ||
    typeof countryObj !== "object" ||
    Array.isArray(countryObj)
  )
    return [];
  return Object.entries(countryObj).map(([code, entries]) => ({
    month: "",
    country: isoToCountryName(code),
    beneficiaryCount: Array.isArray(entries)
      ? entries.reduce((sum, e) => sum + (e.Count ?? 0), 0)
      : 0,
  }));
};

/**
 * BeneficiariesAnalytics Component
 *
 * Displays:
 * 1. Beneficiary Growth Trend (Line Chart) - time range selector with 7D / 30D / 1Y / All / Custom
 *    - 7D     → last 7 days, daily points  ("Beneficiaries count 7 days")
 *    - 30D    → last 30 days, daily points ("Beneficiaries count 1 month")
 *    - 1Y     → last year, monthly points  ("Beneficiaries count 1 year")
 *    - All    → full history, fetched with a wide date range ("Beneficiaries count custom date range")
 *    - Custom → user-supplied date range + day/week/month group_by
 * 2. Beneficiaries by Country (Bar Chart / Map) - with independent time range selector
 *    Country data ("Beneficiaries count by country <period>") is fetched separately
 *    when its time range differs from the trend range.
 */
const BeneficiariesAnalytics = () => {
  // Trend time range states
  const [timeRange, setTimeRange] = useState("all"); // 7d, 30d, 1yr, all, custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [customGroupBy, setCustomGroupBy] = useState("day"); // day, week, month

  // Country time range states (independent of trend)
  const [countryTimeRange, setCountryTimeRange] = useState("all");
  const [countryCustomStart, setCountryCustomStart] = useState("");
  const [countryCustomEnd, setCountryCustomEnd] = useState("");

  const [showTop10Only, setShowTop10Only] = useState(true);
  const [geoViewType, setGeoViewType] = useState("bar"); // bar or map
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // Trend API state
  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Country API state — populated only when the country time range differs from the
  // trend time range; otherwise the trend apiData is reused to avoid a duplicate call.
  const [countryApiData, setCountryApiData] = useState(null);
  const [countryApiLoading, setCountryApiLoading] = useState(false);

  // fetchParams drives the trend fetch effect. Initialized to the "All" params
  // because the default timeRange is "all".
  const [fetchParams, setFetchParams] = useState(() =>
    buildFetchParams("all", "", "", ""),
  );

  // Update fetchParams whenever the trend time range or custom inputs change.
  // The functional updater bails out when the serialized params haven't changed,
  // preventing a redundant API call (e.g. when toggling between 7D/30D/1Y).
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

  // Fetch trend data whenever fetchParams changes
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setApiLoading(true);
        const response = await getBeneficiariesTrendAnalysis(fetchParams);
        console.log("Beneficiaries API response:", response);
        if (!cancelled) {
          setApiData(response);
          setApiError(null);
        }
      } catch (error) {
        console.error("Failed to fetch beneficiaries analytics:", error);
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

  // Fetch country data separately when its time range differs from the trend range.
  // If the derived params match the trend params we already have, clear countryApiData
  // so the trend apiData is reused instead.
  useEffect(() => {
    const params = buildFetchParams(
      countryTimeRange,
      countryCustomStart,
      countryCustomEnd,
      "month",
    );
    if (!params) return;

    if (JSON.stringify(params) === JSON.stringify(fetchParams)) {
      setCountryApiData(null);
      return;
    }

    let cancelled = false;
    const fetchData = async () => {
      try {
        setCountryApiLoading(true);
        const response = await getBeneficiariesTrendAnalysis(params);
        if (!cancelled) setCountryApiData(response);
      } catch {
        if (!cancelled) setCountryApiData(null);
      } finally {
        if (!cancelled) setCountryApiLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [countryTimeRange, countryCustomStart, countryCustomEnd, fetchParams]);

  // Format month for display (e.g., "2025-01" → "Jan 2025")
  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Format a date string for display.
  // 1Y and All return pre-grouped monthly data; Custom with group_by "month" also
  // shows month labels. Everything else (day/week) shows a short date.
  const formatLabel = (dateStr, range, groupBy) => {
    if (!dateStr) return "";
    const monthly =
      range === "1yr" ||
      range === "all" ||
      (range === "custom" && groupBy === "month");
    if (monthly) return formatMonthLabel(dateStr.substring(0, 7));
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Extract growth data from API response, fallback to static data
  const chartData = useMemo(() => {
    if (apiData) {
      const body = apiData.body ?? apiData;
      const points = normalizeItems(body[BENEFICIARY_TREND_KEYS[timeRange]]);
      if (points.length > 0) {
        return points.map((item) => ({
          label: formatLabel(item.date, timeRange, customGroupBy),
          count: item.count,
        }));
      }
    }

    // Fallback: use static monthly data
    return beneficiariesGrowthDataFallback.map((item) => ({
      label: formatMonthLabel(item.month),
      count: item.newBeneficiaries,
    }));
  }, [apiData, timeRange, customGroupBy]); // eslint-disable-line react-hooks/exhaustive-deps

  // Country data source: use the dedicated country fetch when available, otherwise
  // fall back to the trend apiData (which includes country data for 7D/30D/1Y).
  const effectiveCountrySource = countryApiData ?? apiData;

  // Extract country data for the selected country time range, fallback to static data.
  // The API returns country data as an object keyed by ISO alpha-3 code; parseCountryData
  // sums all date entries per country into a single beneficiaryCount.
  const beneficiariesByCountryData = useMemo(() => {
    if (effectiveCountrySource) {
      const body = effectiveCountrySource.body ?? effectiveCountrySource;
      const countryKey = COUNTRY_DATA_KEYS[countryTimeRange];
      const parsed = parseCountryData(body[countryKey]);
      if (parsed.length > 0) return parsed;
    }
    return beneficiariesByCountryDataFallback;
  }, [effectiveCountrySource, countryTimeRange]);

  // Process country data - aggregate totals by country with top 10 option
  const processCountryData = useMemo(() => {
    const countryTotals = {};

    beneficiariesByCountryData.forEach((item) => {
      if (!countryTotals[item.country]) {
        countryTotals[item.country] = 0;
      }
      countryTotals[item.country] += item.beneficiaryCount;
    });

    const sortedData = Object.entries(countryTotals)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    return showTop10Only ? sortedData.slice(0, 10) : sortedData;
  }, [showTop10Only, beneficiariesByCountryData]);

  const countryData = processCountryData;

  // Process country data for choropleth map with color intensity
  const countryDataMap = useMemo(() => {
    const map = {};
    processCountryData.forEach((item) => {
      map[item.country] = item.count;
    });
    return map;
  }, [processCountryData]);

  // Get max count for color scaling
  const maxBeneficiaries = useMemo(() => {
    return Math.max(...processCountryData.map((item) => item.count), 1);
  }, [processCountryData]);

  // Get color based on beneficiary count
  const getCountryColor = (count) => {
    if (!count) return "#e5e7eb"; // Light gray for countries with no data
    const intensity = count / maxBeneficiaries;
    // Purple gradient from light to dark
    const hue = 270; // Purple
    const saturation = 60;
    const lightness = 80 - intensity * 50; // Range from 80% (light) to 30% (dark)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Chart 1: Beneficiary Growth Trend with Time Range Selector */}
      <ChartContainer title="Beneficiary Growth Trend" description="">
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
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs bg-white"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
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
          <div className="flex items-center justify-center h-64 text-gray-500">
            Loading beneficiaries data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
                formatter={(value) => [value, "Beneficiaries"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
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

      {/* Chart 2: Beneficiaries by Country with Top 10 Panel */}
      <ChartContainer
        title="Beneficiaries by Country"
        description="Geographic distribution of beneficiaries"
      >
        {/* Country Time Range Selector */}
        <div className="flex gap-1.5 mb-2 flex-wrap items-center">
          <span className="text-xs text-gray-500 font-medium">Period:</span>
          {[
            { id: "all", label: "All" },
            { id: "7d", label: "7D" },
            { id: "30d", label: "30D" },
            { id: "1yr", label: "1Y" },
            { id: "custom", label: "Custom" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setCountryTimeRange(id)}
              className={`px-2 py-0.5 text-xs rounded ${
                countryTimeRange === id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
          {countryTimeRange === "custom" && (
            <>
              <input
                type="date"
                value={countryCustomStart}
                onChange={(e) => setCountryCustomStart(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
              <span className="text-xs text-gray-500">→</span>
              <input
                type="date"
                value={countryCustomEnd}
                onChange={(e) => setCountryCustomEnd(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
            </>
          )}
        </div>

        <div className="mb-2 flex gap-2 items-center flex-wrap">
          <div className="flex gap-1">
            <button
              onClick={() => setGeoViewType("bar")}
              className={`px-2 py-0.5 text-xs rounded ${
                geoViewType === "bar"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setGeoViewType("map")}
              className={`px-2 py-0.5 text-xs rounded ${
                geoViewType === "map"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Map
            </button>
          </div>
          {geoViewType === "bar" && (
            <label className="inline-flex items-center cursor-pointer text-xs text-gray-600 gap-1">
              <input
                type="checkbox"
                checked={showTop10Only}
                onChange={(e) => setShowTop10Only(e.target.checked)}
                className="cursor-pointer"
              />
              Top 10 Only
            </label>
          )}
          {countryApiLoading && (
            <span className="text-xs text-gray-400 italic">Updating…</span>
          )}
        </div>

        {geoViewType === "bar" ? (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={countryData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis
                  dataKey="country"
                  type="category"
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  name="Beneficiaries"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Top Countries Summary Panel */}
            {showTop10Only && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Top 10 Countries Summary
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {countryData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {index + 1}. {item.country}
                      </span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Choropleth Map */}
            <div className="relative bg-gray-50 rounded-lg p-4">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 100,
                }}
                width={800}
                height={400}
              >
                <ZoomableGroup center={[0, 20]} zoom={1}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const countryName = geo.properties.name;
                        const count = countryDataMap[countryName] || 0;
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={getCountryColor(count)}
                            stroke="#fff"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: {
                                fill: "#8b5cf6",
                                outline: "none",
                                cursor: "pointer",
                              },
                              pressed: { outline: "none" },
                            }}
                            onMouseEnter={() => {
                              setHoveredCountry({ name: countryName, count });
                            }}
                            onMouseLeave={() => {
                              setHoveredCountry(null);
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>

              {/* Hover Tooltip */}
              {hoveredCountry && hoveredCountry.count > 0 && (
                <div className="absolute top-4 left-4 bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                  <p className="text-sm font-semibold text-gray-800">
                    {hoveredCountry.name}
                  </p>
                  <p className="text-sm text-purple-600">
                    {hoveredCountry.count} Beneficiaries
                  </p>
                </div>
              )}
            </div>

            {/* Top 10 Countries Legend Panel */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Top 10 Countries by Beneficiary Count
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {processCountryData.slice(0, 10).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: getCountryColor(item.count),
                        }}
                      ></div>
                      <span className="text-gray-700">
                        {index + 1}. {item.country}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Note: Click on country to drill down to state/regional level
                (requires state_id and city data in dataset)
              </p>
            </div>
          </>
        )}
      </ChartContainer>
    </div>
  );
};

export default BeneficiariesAnalytics;
