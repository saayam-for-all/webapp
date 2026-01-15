import { useState, useMemo } from "react";
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
  ReferenceLine,
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import requestsVolumeData from "../../../../data/analytics/requests_volume_monthly.json";
import requestsByCategoryRegionData from "../../../../data/analytics/requests_by_category_region_monthly.json";

/**
 * RequestsAnalytics Component
 *
 * Displays:
 * 1. Request Volume Trend (Area Chart) - Monthly request counts with comparison to previous period
 * 2. Request by Category & Region (Stacked Bar Chart) - Category distribution by country with monthly trends
 */
const RequestsAnalytics = () => {
  // Time range states
  const [timeRange, setTimeRange] = useState("all"); // all, 7d, 30d, 1yr, custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("total"); // total, name
  const [hiddenCountries, setHiddenCountries] = useState(new Set());

  // Format month for display (e.g., "2025-01" -> "Jan 2025")
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Filter data based on time range
  const getFilteredVolumeData = useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();
    let endDate = now;

    if (timeRange === "7d") {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === "30d") {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (timeRange === "1yr") {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    } else if (timeRange === "custom" && customStartDate && customEndDate) {
      cutoffDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    }

    const filtered =
      timeRange === "all"
        ? requestsVolumeData
        : requestsVolumeData.filter((item) => {
            const itemDate = new Date(item.month + "-01");
            if (timeRange === "custom") {
              return itemDate >= cutoffDate && itemDate <= endDate;
            }
            return itemDate >= cutoffDate;
          });

    // Calculate previous period comparison
    return filtered.map((item, index) => {
      const prevItem = index > 0 ? filtered[index - 1] : null;
      const percentChange = prevItem
        ? ((item.requestCount - prevItem.requestCount) /
            prevItem.requestCount) *
          100
        : 0;

      return {
        ...item,
        monthFormatted: formatMonth(item.month),
        percentChange: percentChange.toFixed(1),
        previousPeriod: prevItem ? prevItem.requestCount : null,
      };
    });
  }, [timeRange, customStartDate, customEndDate]);

  const volumeData = getFilteredVolumeData;

  // Process stacked bar data for category & region
  const processStackedData = useMemo(() => {
    // Get unique countries
    const allCountries = [
      ...new Set(requestsByCategoryRegionData.map((item) => item.country)),
    ].sort();

    // Filter by selected category (if not "all")
    let filteredData =
      selectedCategory === "all"
        ? requestsByCategoryRegionData
        : requestsByCategoryRegionData.filter(
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
      categoryMap[item.category][item.country] += item.requestCount;
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

    // Filter countries that aren't hidden
    const visibleCountries = allCountries.filter(
      (country) => !hiddenCountries.has(country),
    );

    return { data: result, countries: allCountries, visibleCountries };
  }, [selectedCountry, selectedCategory, sortBy, hiddenCountries]);

  // Get unique countries and categories for filter dropdowns
  const countries = useMemo(() => {
    return [
      ...new Set(requestsByCategoryRegionData.map((item) => item.country)),
    ].sort();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(requestsByCategoryRegionData.map((item) => item.category)),
    ].sort();
  }, []);

  // Toggle country visibility in legend
  const toggleCountry = (country) => {
    setHiddenCountries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(country)) {
        newSet.delete(country);
      } else {
        newSet.add(country);
      }
      return newSet;
    });
  };

  // Custom tooltip for volume trend
  const CustomVolumeTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-800">{data.monthFormatted}</p>
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

  // Colors for stacked bars
  const COUNTRY_COLORS = {
    India: "#3b82f6",
    USA: "#10b981",
    Canada: "#f59e0b",
    Australia: "#ef4444",
    "United Kingdom": "#8b5cf6",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          📊 Requests Analytics
        </h2>
        <p className="text-sm text-gray-500">
          Overview of request volume and distribution
        </p>
      </div>

      {/* Chart 1: Request Volume Trend with Time Range Selector */}
      <ChartContainer title="Request Volume Trend" description="">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4 flex-wrap items-center">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1 text-sm rounded ${
              timeRange === "7d"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 text-sm rounded ${
              timeRange === "30d"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange("1yr")}
            className={`px-3 py-1 text-sm rounded ${
              timeRange === "1yr"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            1 Year
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`px-3 py-1 text-sm rounded ${
              timeRange === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeRange("custom")}
            className={`px-3 py-1 text-sm rounded ${
              timeRange === "custom"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Custom Range
          </button>

          {/* Custom Date Range Inputs */}
          {timeRange === "custom" && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Start:
                </label>
                <input
                  type="month"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  End:
                </label>
                <input
                  type="month"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </>
          )}
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={volumeData}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="monthFormatted"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
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
      </ChartContainer>

      {/* Chart 2: Request by Category & Region (Stacked Bar) */}
      <ChartContainer
        title="Requests by Category & Region"
        description="Geographic distribution of requests across categories"
      >
        {/* Filters */}
        <div className="flex gap-4 mb-4 items-center flex-wrap">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Category Type:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Country:
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="total">Total Requests</option>
              <option value="name">Category Name</option>
            </select>
          </div>
        </div>

        {/* Interactive Legend - Toggle Countries On/Off */}
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            Interactive Legend (Click to toggle countries):
          </p>
          <div className="flex gap-2 flex-wrap">
            {processStackedData.countries.map((country) => (
              <button
                key={country}
                onClick={() => toggleCountry(country)}
                className={`px-3 py-1 text-sm rounded border transition-all ${
                  hiddenCountries.has(country)
                    ? "bg-gray-200 text-gray-400 border-gray-300 line-through"
                    : "bg-white border-gray-400 hover:bg-gray-100"
                }`}
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: hiddenCountries.has(country)
                    ? "#d1d5db"
                    : COUNTRY_COLORS[country] || "#6b7280",
                }}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
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
