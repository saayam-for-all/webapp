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

// Map time range selection to the corresponding API response key
const BENEFICIARY_TREND_KEYS = {
  daily: "7 days beneficiaries",
  weekly: "1 month beneficiaries", // aggregated client-side into weekly buckets
  monthly: "1 year beneficiaries",
  all: "1 year beneficiaries",
  custom: "Custom date range beneficiaries",
};

// Normalize API items { Date, Count } → { date, count }
const normalizeItems = (arr) =>
  (arr ?? []).map((item) => ({
    date: (item.Date ?? "").split("T")[0],
    count: item.Count ?? 0,
  }));

// Format country name from UPPER_CASE_WITH_UNDERSCORES → Title Case
const formatCountryName = (name) =>
  name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * BeneficiariesAnalytics Component
 *
 * Displays:
 * 1. Beneficiary Growth Trend (Line Chart) - time range selector with Daily / Weekly / Monthly / All / Custom
 *    - Daily   → last 7 days  ("7 days beneficiaries")
 *    - Weekly  → last month daily data aggregated into weekly buckets ("1 month beneficiaries")
 *    - Monthly → last year monthly data ("1 year beneficiaries")
 *    - All     → same as Monthly (full year dataset)
 *    - Custom  → re-fetches with user-supplied date range ("Custom date range beneficiaries")
 * 2. Beneficiaries by Country (Bar Chart with Top 10 Panel) - Geographic distribution
 */
const BeneficiariesAnalytics = () => {
  // Time range states
  const [timeRange, setTimeRange] = useState("monthly"); // daily, weekly, monthly, all, custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // fetchParams drives the useEffect; changes on mount or when custom dates are both filled
  const [fetchParams, setFetchParams] = useState({
    beneficiaries_start_date: getRelativeDate(-30),
    beneficiaries_end_date: getRelativeDate(0),
    help_requests_start_date: getRelativeDate(-60),
    help_requests_end_date: getRelativeDate(0),
  });

  const [showTop10Only, setShowTop10Only] = useState(true);
  const [geoViewType, setGeoViewType] = useState("bar"); // bar or map
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Fetch data from API on mount and whenever fetchParams changes
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

  // Auto re-fetch when both custom dates are filled
  useEffect(() => {
    if (timeRange === "custom" && customStartDate && customEndDate) {
      setFetchParams({
        beneficiaries_start_date: customStartDate,
        beneficiaries_end_date: customEndDate,
        help_requests_start_date: customStartDate,
        help_requests_end_date: customEndDate,
      });
    }
  }, [customStartDate, customEndDate, timeRange]);

  // Format month for display
  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Format a date string for display based on current time range
  const formatLabel = (dateStr, range) => {
    if (!dateStr) return "";
    if (range === "monthly" || range === "all")
      return formatMonthLabel(dateStr.substring(0, 7));
    if (range === "weekly") return dateStr; // already "YYYY-Www" from aggregation
    // daily and custom — show "May 22" style
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Aggregate a flat array of { date, count } items into weekly buckets
  const aggregateWeekly = (items) => {
    const map = {};
    items.forEach((item) => {
      const d = new Date(item.date + "T00:00:00");
      const startOfYear = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(
        ((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7,
      );
      const key = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
      if (!map[key]) map[key] = { date: key, count: 0 };
      map[key].count += item.count;
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Extract growth data from API response, fallback to mock data
  const chartData = useMemo(() => {
    if (apiData) {
      const body = apiData.body ?? apiData;

      // Check common response shapes
      const key = BENEFICIARY_TREND_KEYS[timeRange];
      const raw = normalizeItems(body[key]);

      if (raw.length > 0) {
        // Weekly view: aggregate the daily "1 month" data into weekly buckets
        const aggregated = timeRange === "weekly" ? aggregateWeekly(raw) : raw;
        return aggregated.map((item) => ({
          label: formatLabel(item.date, timeRange),
          count: item.count,
        }));
      }
    }

    // Fallback: use mock monthly data
    return beneficiariesGrowthDataFallback.map((item) => ({
      label: formatMonthLabel(item.month),
      count: item.newBeneficiaries,
    }));
  }, [apiData, timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  // Extract country data from API response, fallback to mock data
  const beneficiariesByCountryData = useMemo(() => {
    if (apiData) {
      const body = apiData.body ?? apiData;

      const countryData = body["Country beneficiaries"];

      if (Array.isArray(countryData) && countryData.length > 0) {
        return countryData.map((item) => ({
          month: "",
          country: formatCountryName(item.country ?? ""),
          beneficiaryCount: item.Count ?? 0,
        }));
      }
    }

    return beneficiariesByCountryDataFallback;
  }, [apiData]);

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
            { id: "daily", label: "Daily" },
            { id: "weekly", label: "Weekly" },
            { id: "monthly", label: "Monthly" },
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
