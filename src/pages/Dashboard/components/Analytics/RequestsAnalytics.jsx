import { useState, useEffect, useMemo, useRef } from "react";
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
  ReferenceLine,
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import { getRequestsApplicationAnalytics } from "../../../../services/analyticsServices";
import { isoAlpha3ToName } from "../../../../utils/isoCountryNames";

/**
 * RequestsAnalytics Component
 *
 * Displays:
 * 1. Request Volume Trend (Line Chart) - Time series of request counts with time range selection
 * 2. Request by Category & Region (Stacked Bar Chart) - Category distribution by country
 */
const RequestsAnalytics = () => {
  // API Response Data
  const [trendData, setTrendData] = useState([]);
  const [categoryRegionData, setCategoryRegionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultApiDataRef = useRef(null);

  // Time range states
  const [timeRange, setTimeRange] = useState("all"); // all, 7d, 30d, 1yr, custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("day"); // day or month
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("total"); // total, name

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
      custom: "requests_by_category_region custom range",
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

    setTrendData(parsedTrendData);
    setCategoryRegionData(parsedCategoryData);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Reuse cached default response for preset tabs (7D, 30D, 1Y, All)
        if (timeRange !== "custom" && defaultApiDataRef.current) {
          applyDataForRange(defaultApiDataRef.current, timeRange);
          setLoading(false);
          return;
        }

        // Build payload based on time range
        let payload = {};
        if (timeRange === "custom") {
          if (!customStartDate || !customEndDate) {
            setLoading(false);
            return;
          }
          payload = {
            start_date: customStartDate,
            end_date: customEndDate,
            group_by: groupBy,
          };
        }

        // Call API
        const response = await getRequestsApplicationAnalytics(payload);

        // Extract body from response (API wraps data in statusCode and body)
        const data = response.body || response;

        // Cache default response because it already contains all preset windows
        if (timeRange !== "custom") {
          defaultApiDataRef.current = data;
        }

        applyDataForRange(data, timeRange);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(err.message || "Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange, customStartDate, customEndDate, groupBy]);

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

    // Filter by selected category (if not "all")
    let filteredData =
      selectedCategory === "all"
        ? categoryRegionData
        : categoryRegionData.filter(
            (item) => item.category === selectedCategory,
          );

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
    selectedCategory,
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

  // Colors for stacked bars
  const COUNTRY_COLORS = {
    India: "#3b82f6",
    USA: "#10b981",
    Canada: "#f59e0b",
    Australia: "#ef4444",
    "United Kingdom": "#8b5cf6",
  };

  // Show loading or error states
  if (loading && timeRange !== "custom") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <ChartContainer title="Request Volume Trend" description="">
          <div className="flex items-center justify-center h-[210px] text-gray-500">
            Loading data...
          </div>
        </ChartContainer>
        <ChartContainer
          title="Requests by Category & Region"
          description="Geographic distribution of requests across categories"
        >
          <div className="flex items-center justify-center h-[210px] text-gray-500">
            Loading data...
          </div>
        </ChartContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <ChartContainer title="Request Volume Trend" description="">
          <div className="flex items-center justify-center h-[210px] text-red-500">
            Error: {error}
          </div>
        </ChartContainer>
        <ChartContainer
          title="Requests by Category & Region"
          description="Geographic distribution of requests across categories"
        >
          <div className="flex items-center justify-center h-[210px] text-red-500">
            Error: {error}
          </div>
        </ChartContainer>
      </div>
    );
  }

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
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              >
                <option value="day">Group: Day</option>
                <option value="month">Group: Month</option>
              </select>
            </>
          )}
        </div>

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
      </ChartContainer>

      {/* Chart 2: Request by Category & Region (Stacked Bar) */}
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
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
                borderLeftColor: COUNTRY_COLORS[country] || "#6b7280",
              }}
            >
              <span className="font-bold text-gray-400">#{index + 1}</span>
              <span className="font-medium text-gray-700">{country}</span>
              <span className="text-gray-400">({total})</span>
            </div>
          ))}
        </div>

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
      </ChartContainer>
    </div>
  );
};

export default RequestsAnalytics;
