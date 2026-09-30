import { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
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
import ChartContainer from "./charts/ChartContainer";
import { getRequestsApplicationAnalytics } from "../../../../services/analyticsServices";
import { isoAlpha3ToName } from "../../../../utils/isoCountryNames";

const emptyDataMessage = (data) =>
  data?.has_errors
    ? `Error: ${data.error_message || "Some analytics data could not be loaded. Please try refreshing."}`
    : "No data available for the selected period";

const applyDataForRange = (data, range) => {
  const volumeKeyMap = {
    "7d": "request_volume_7_days",
    "30d": "request_volume_1_month",
    "1yr": "request_volume_1_year",
    all: "request_volume_1_year", // Use 1 year for "all" view
    custom: "request_volume_custom_range",
  };

  const categoryKeyMap = {
    "7d": "requests_by_category_region 7 days",
    "30d": "requests_by_category_region 1 month",
    "1yr": "requests_by_category_region 1 year",
    all: "requests_by_category_region 1 year",
    custom: "requests_by_category_region_custom_range",
  };

  const volumeKey = volumeKeyMap[range];
  const categoryKey = categoryKeyMap[range];

  const parsedTrendData = Array.isArray(data?.[volumeKey])
    ? data[volumeKey].map((item) => ({
        date: (item.date || "").split("T")[0],
        count: item.count || 0,
      }))
    : [];

  const parsedCategoryData = Array.isArray(data?.[categoryKey])
    ? data[categoryKey].map((item) => ({
        category: item.category || "",
        country: isoAlpha3ToName(item.country) || item.country,
        countryCode: item.country,
        count: item.count || 0,
      }))
    : [];

  return { trend: parsedTrendData, categoryRegion: parsedCategoryData };
};

// Independent chart requests prevent one custom range from blocking the other.
const useRequestRange = (range, startDate, endDate, defaultRequestRef) => {
  const [result, setResult] = useState({
    data: null,
    message: "Loading data...",
  });
  const validation =
    range === "custom"
      ? !startDate || !endDate
        ? "Select a start and end date"
        : startDate > endDate
          ? "Start date must be on or before end date"
          : null
      : null;

  useEffect(() => {
    let cancelled = false;
    if (validation) {
      setResult({ data: null, message: validation });
      return;
    }
    setResult((previous) => ({ ...previous, message: "Loading data..." }));
    const fetchData = async () => {
      try {
        let response;
        if (range === "custom") {
          // The API chooses daily or monthly grouping from the date range.
          response = await getRequestsApplicationAnalytics({
            start_date: startDate,
            end_date: endDate,
          });
        } else {
          if (!defaultRequestRef.current) {
            defaultRequestRef.current = getRequestsApplicationAnalytics(
              {},
            ).catch((error) => {
              defaultRequestRef.current = null;
              throw error;
            });
          }
          response = await defaultRequestRef.current;
        }
        if (!cancelled)
          setResult({ data: response?.body || response, message: null });
      } catch (error) {
        if (!cancelled)
          setResult({
            data: null,
            message: `Error: ${error.message || "Failed to fetch analytics data"}`,
          });
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [range, startDate, endDate, validation, defaultRequestRef]);

  return result;
};

/**
 * RequestsAnalytics Component
 *
 * Displays:
 * 1. Request Volume Trend (Line Chart) - Time series of request counts with time range selection
 * 2. Request by Category & Region (Stacked Bar Chart) - Category distribution by country
 */
const RequestsAnalytics = () => {
  const defaultApiDataRef = useRef(null);
  const [timeRange, setTimeRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [timeRangeCat, setTimeRangeCat] = useState("all");
  const [customStartDateCat, setCustomStartDateCat] = useState("");
  const [customEndDateCat, setCustomEndDateCat] = useState("");
  const trend = useRequestRange(
    timeRange,
    customStartDate,
    customEndDate,
    defaultApiDataRef,
  );
  const category = useRequestRange(
    timeRangeCat,
    customStartDateCat,
    customEndDateCat,
    defaultApiDataRef,
  );
  const trendData = applyDataForRange(trend.data, timeRange).trend;
  const categoryRegionData = useMemo(
    () => applyDataForRange(category.data, timeRangeCat).categoryRegion,
    [category.data, timeRangeCat],
  );

  const [selectedCountry, setSelectedCountry] = useState("all");
  // Category multi-select with limit
  const [categoryLimit, setCategoryLimit] = useState(5); // default top 5
  const [selectedCategories, setSelectedCategories] = useState([]); // array of category names
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState("total"); // total, name

  // Compute top 5 countries by total request count
  const top5Countries = useMemo(() => {
    const countryTotals = {};
    categoryRegionData.forEach((item) => {
      countryTotals[item.country] =
        (countryTotals[item.country] || 0) + item.count;
    });
    return Object.entries(countryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, total]) => ({ country, total }));
  }, [categoryRegionData]);

  // Process stacked bar data for category & region
  const processStackedData = useMemo(() => {
    // Use top 5 countries (by total requests)
    const top5CountryNames = top5Countries.map((c) => c.country);

    // Filter by selected categories (if any). If none selected, include all categories.
    let filteredData =
      selectedCategories && selectedCategories.length > 0
        ? categoryRegionData.filter((item) =>
            selectedCategories.includes(item.category),
          )
        : categoryRegionData;

    // Filter by selected country (if not "all")
    if (selectedCountry !== "all") {
      filteredData = filteredData.filter(
        (item) => item.country === selectedCountry,
      );
    }

    // Group by category
    const categoryMap = {};
    filteredData.forEach((item) => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = { category: item.category };
      }
      if (!categoryMap[item.category][item.country]) {
        categoryMap[item.category][item.country] = 0;
      }
      categoryMap[item.category][item.country] += item.count;
    });

    let result = Object.values(categoryMap);

    // If no explicit categories selected, limit to top N categories by total where N = categoryLimit
    if (
      (!selectedCategories || selectedCategories.length === 0) &&
      categoryLimit
    ) {
      // compute totals per category
      const totals = result
        .map((r) => ({
          category: r.category,
          total: Object.keys(r)
            .filter((k) => k !== "category")
            .reduce((s, k) => s + (r[k] || 0), 0),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, categoryLimit)
        .map((r) => r.category);
      result = result.filter((r) => totals.includes(r.category));
    }

    // Calculate totals for sorting
    result = result.map((item) => {
      const total = Object.keys(item)
        .filter((key) => key !== "category")
        .reduce((sum, key) => sum + (item[key] || 0), 0);
      return { ...item, total };
    });

    // Sort
    if (sortBy === "total") {
      result.sort((a, b) => b.total - a.total);
    } else {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    // Determine visible countries: if filtering by a single country show that,
    // otherwise show the top 5
    const visibleCountries =
      selectedCountry !== "all" ? [selectedCountry] : top5CountryNames;

    return { data: result, visibleCountries };
  }, [
    selectedCountry,
    selectedCategories,
    categoryLimit,
    sortBy,
    top5Countries,
    categoryRegionData,
  ]);

  // Get unique countries and categories for filter dropdowns
  const countries = useMemo(() => {
    return [...new Set(categoryRegionData.map((item) => item.country))].sort();
  }, [categoryRegionData]);

  const categories = useMemo(() => {
    return [...new Set(categoryRegionData.map((item) => item.category))].sort();
  }, [categoryRegionData]);

  // Custom tooltip for volume trend
  const CustomVolumeTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-800">{data.date}</p>
          <p className="text-sm text-blue-600">Requests: {data.count}</p>
        </div>
      );
    }
    return null;
  };

  CustomVolumeTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        payload: PropTypes.shape({
          date: PropTypes.string,
          count: PropTypes.number,
        }),
      }),
    ),
  };

  // Colors for stacked bars
  const COUNTRY_COLORS = {
    India: "#3b82f6",
    USA: "#10b981",
    Canada: "#f59e0b",
    Australia: "#ef4444",
    "United Kingdom": "#8b5cf6",
  };

  const FALLBACK_COLORS = [
    "#6b7280",
    "#059669",
    "#d97706",
    "#0ea5d8",
    "#7c3aed",
    "#f97316",
  ];

  const getCountryColor = (country) => {
    if (COUNTRY_COLORS[country]) return COUNTRY_COLORS[country];
    // deterministic fallback by hashing country string
    let hash = 0;
    for (let i = 0; i < country.length; i++) {
      hash = country.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % FALLBACK_COLORS.length;
    return FALLBACK_COLORS[idx];
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Chart 1: Request Volume Trend with Time Range Selector */}
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
                aria-label="Request volume start date"
                max={customEndDate || undefined}
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
              <span className="text-xs text-gray-500">→</span>
              <input
                type="date"
                aria-label="Request volume end date"
                min={customStartDate || undefined}
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
            </>
          )}
        </div>

        {trend.message || trendData.length === 0 ? (
          <div
            role="status"
            className="flex items-center justify-center h-[210px] text-gray-600"
          >
            {trend.message || emptyDataMessage(trend.data)}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip content={<CustomVolumeTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Requests"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* Chart 2: Request by Category & Region (Stacked Bar) */}
      <ChartContainer
        title="Requests by Category & Region"
        description="Geographic distribution of requests across categories"
        className="overflow-hidden"
      >
        {/* Filters: category multi-select, time range, country, sort, limit */}
        <div className="flex gap-2 mb-2 items-center flex-wrap">
          {/* Category multi-select dropdown (checkboxes) */}
          <div className="relative">
            <button
              onClick={() => setCategoryDropdownOpen((s) => !s)}
              className="px-2 py-0.5 border border-gray-300 rounded text-xs bg-white max-w-full"
            >
              {selectedCategories && selectedCategories.length > 0
                ? `${selectedCategories.length} selected`
                : "All Categories"}
            </button>
            {categoryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-56 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded shadow-md p-2 max-h-48 overflow-auto">
                <div className="text-xs text-gray-600 mb-1">
                  Select up to {categoryLimit}
                </div>
                {categories.map((cat) => {
                  const checked = selectedCategories.includes(cat);
                  const disabled =
                    !checked && selectedCategories.length >= categoryLimit;
                  return (
                    <label
                      key={cat}
                      className="flex items-center gap-2 text-xs py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (selectedCategories.length < categoryLimit) {
                              setSelectedCategories((s) => [...s, cat]);
                            }
                          } else {
                            setSelectedCategories((s) =>
                              s.filter((c) => c !== cat),
                            );
                          }
                        }}
                      />
                      <span>{cat}</span>
                    </label>
                  );
                })}
                <div className="mt-2 flex justify-between">
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                    }}
                    className="text-xs text-gray-600"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="text-xs text-blue-600"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Category limit selector */}
          <select
            value={categoryLimit}
            onChange={(e) => setCategoryLimit(Number(e.target.value))}
            className="px-2 py-0.5 border border-gray-300 rounded text-xs"
          >
            <option value={5}>Top 5</option>
            <option value={7}>Top 7</option>
            <option value={8}>Top 8</option>
          </select>

          {/* Category chart time range controls */}
          <div className="flex gap-1.5 items-center flex-wrap">
            {[
              { id: "7d", label: "7D" },
              { id: "30d", label: "30D" },
              { id: "1yr", label: "1Y" },
              { id: "all", label: "All" },
              { id: "custom", label: "Custom" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTimeRangeCat(id)}
                className={`px-2 py-0.5 text-xs rounded ${
                  timeRangeCat === id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
            {timeRangeCat === "custom" && (
              <>
                <input
                  type="date"
                  aria-label="Category start date"
                  max={customEndDateCat || undefined}
                  value={customStartDateCat}
                  onChange={(e) => setCustomStartDateCat(e.target.value)}
                  className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
                />
                <span className="text-xs text-gray-500">to</span>
                <input
                  type="date"
                  aria-label="Category end date"
                  min={customStartDateCat || undefined}
                  value={customEndDateCat}
                  onChange={(e) => setCustomEndDateCat(e.target.value)}
                  className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
                />
              </>
            )}
          </div>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-2 py-0.5 border border-gray-300 rounded text-xs"
          >
            <option value="all">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
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
                borderLeftColor: getCountryColor(country),
              }}
            >
              <span className="font-bold text-gray-400">#{index + 1}</span>
              <span className="font-medium text-gray-700">{country}</span>
              <span className="text-gray-400">({total})</span>
            </div>
          ))}
        </div>

        {category.message || processStackedData.data.length === 0 ? (
          <div
            role="status"
            className="flex items-center justify-center h-[210px] text-gray-600"
          >
            {category.message || emptyDataMessage(category.data)}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={processStackedData.data}
              layout="vertical"
              margin={{ left: 32, right: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) =>
                  String(value || "").replaceAll("_", " ")
                }
                stroke="#6b7280"
                width={170}
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
                  fill={getCountryColor(country)}
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
