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
  ComposedChart,
  Line,
} from "recharts";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import ChartContainer from "./charts/ChartContainer";
import beneficiariesGrowthData from "../../../../data/analytics/beneficiaries_growth_monthly.json";
import beneficiariesByCountryData from "../../../../data/analytics/beneficiaries_by_country_monthly.json";

// World map GeoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * BeneficiariesAnalytics Component
 *
 * Displays:
 * 1. Beneficiary Growth Trend (Area Chart with Cumulative Line Overlay) - Dual Y-axis showing new and total beneficiaries
 * 2. Beneficiaries by Country (Bar Chart with Top 10 Panel) - Geographic distribution
 */
const BeneficiariesAnalytics = () => {
  const [timeAdjustment, setTimeAdjustment] = useState("monthly"); // daily, weekly, monthly
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
  const [showTop10Only, setShowTop10Only] = useState(true);
  const [geoViewType, setGeoViewType] = useState("bar"); // bar or map
  const [hoveredCountry, setHoveredCountry] = useState(null);
  // Format month for display
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Process growth data with cumulative totals for dual Y-axis
  const growthData = useMemo(() => {
    let cumulativeTotal = 0;

    return beneficiariesGrowthData.map((item) => {
      cumulativeTotal += item.newBeneficiaries;
      return {
        ...item,
        monthFormatted: formatMonth(item.month),
        cumulativeTotal,
      };
    });
  }, []);

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
  }, [showTop10Only]);

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
    <div className="space-y-6">
      {/* Chart 1: Beneficiary Growth with Cumulative Overlay (Dual Y-Axis) */}
      <ChartContainer
        title="Beneficiary Growth Trend"
        description="Monthly new beneficiaries (bars) and cumulative total (line) with dual Y-axis"
      >
        {/* Time adjustment and status filter */}
        <div className="mb-4 flex gap-4 items-center flex-wrap">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Status Filter:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Beneficiaries</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <div className="px-3 py-1 text-xs bg-yellow-50 border border-yellow-200 rounded">
            Note: Daily/Weekly time adjustment & status filtering require
            additional data fields
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="monthFormatted"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="#8b5cf6"
              label={{
                value: "New Beneficiaries",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="#10b981"
              label={{
                value: "Cumulative Total",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 12 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-800">
                        {payload[0].payload.monthFormatted}
                      </p>
                      <p className="text-sm text-purple-600">
                        New: {payload[0].payload.newBeneficiaries}
                      </p>
                      <p className="text-sm text-green-600">
                        Total: {payload[0].payload.cumulativeTotal}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="newBeneficiaries"
              fill="#8b5cf6"
              name="New Beneficiaries"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulativeTotal"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 4 }}
              name="Cumulative Total"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Chart 2: Beneficiaries by Country with Top 10 Panel */}
      <ChartContainer
        title="Beneficiaries by Country"
        description="Geographic distribution of beneficiaries"
      >
        <div className="mb-4 flex gap-4 items-center flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setGeoViewType("bar")}
              className={`px-3 py-1 text-sm rounded ${
                geoViewType === "bar"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setGeoViewType("map")}
              className={`px-3 py-1 text-sm rounded ${
                geoViewType === "map"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Choropleth Map
            </button>
          </div>
          {geoViewType === "bar" && (
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTop10Only}
                  onChange={(e) => setShowTop10Only(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show Top 10 Only
                </span>
              </label>
            </div>
          )}
          <span className="text-sm text-gray-500">
            {geoViewType === "map"
              ? "Hover over countries to see counts. Color intensity = beneficiary count."
              : "Click countries to drill down to state/regional level (requires additional data)."}
          </span>
        </div>

        {geoViewType === "bar" ? (
          <>
            <ResponsiveContainer width="100%" height={400}>
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
