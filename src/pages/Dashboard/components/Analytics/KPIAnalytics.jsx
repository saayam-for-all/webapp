import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import { getKpiAnalytics } from "../../../../services/analyticsServices";
/**
 * KPIAnalytics Component
 *
 * Displays:
 * 1. Request Status Distribution (Donut Chart with center metrics and table view)
 * 2. Average Resolution Time by Category (Horizontal Bar Chart with SLA target lines and color grading)
 */
export const renderTooltip =
  (SLA_TARGET, SLA_WARNING) =>
  ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      const status =
        data.avgHours > SLA_TARGET
          ? "Exceeded SLA"
          : data.avgHours > SLA_WARNING
            ? "Approaching SLA"
            : "Within SLA";
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-800">{data.category}</p>
          <p className="text-sm text-gray-600">
            Avg: {data.avgHours} hours ({data.avgDays} days)
          </p>
          <p
            className={`text-sm font-semibold ${
              data.avgHours > SLA_TARGET
                ? "text-red-600"
                : data.avgHours > SLA_WARNING
                  ? "text-yellow-600"
                  : "text-green-600"
            }`}
          >
            {status}
          </p>
        </div>
      );
    }
    return null;
  };

const KPIAnalytics = () => {
  const [showStatusTable, setShowStatusTable] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [breakdownView, setBreakdownView] = useState("category"); // category or region
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getKpiAnalytics();
        setKpiData(data);
      } catch (err) {
        setError("Failed to load KPI data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const SLA_TARGET = kpiData?.sla?.target_hours ?? 240;
  const SLA_WARNING = kpiData?.sla?.warning_hours ?? 200;

  const resolutionData = useMemo(() => {
    if (!kpiData?.average_resolution_time_by_category) return [];
    return kpiData.average_resolution_time_by_category
      .map((item) => ({
        category: item.category,
        avgHours: item.avg_hours,
        avgDays: (item.avg_hours / 24).toFixed(1),
      }))
      .sort((a, b) => b.avgHours - a.avgHours);
  }, [kpiData]);

  const statusData = useMemo(() => {
    if (!kpiData?.request_status_distribution) return [];
    return kpiData.request_status_distribution.map((item) => ({
      name: item.status,
      value: item.count,
    }));
  }, [kpiData]);

  const totalRequests = kpiData?.total_requests ?? 0;

  // Handle segment click
  const handleSegmentClick = (data) => {
    if (data && data.name) {
      setSelectedSegment(data.name);
    }
  };

  // Color mapping for resolution time based on SLA
  const getResolutionColor = (avgHours) => {
    if (avgHours > SLA_TARGET) return "#ef4444"; // Red - exceeded SLA
    if (avgHours > SLA_WARNING) return "#f59e0b"; // Yellow - approaching SLA
    return "#10b981"; // Green - within SLA
  };

  // Colors for status donut chart
  const STATUS_COLORS = {
    CREATED: "#3b82f6", // Blue
    IN_PROGRESS: "#f59e0b", // Orange
    MATCHING_VOLUNTEER: "#8b5cf6", // Purple
    RESOLVED: "#10b981", // Green
  };

  // Custom label for donut center
  /* const renderCenterLabel = ({ viewBox }) => {
    const { cx, cy } = viewBox;
    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-gray-800"
        >
          {totalRequests}
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm fill-gray-500"
        >
          Total Requests
        </text>
      </g>
    );
  }; */

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-500">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm">Loading KPI data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Chart 1: Request Status Distribution (Donut Chart with Center Metrics) */}
      <ChartContainer
        title="Request Status Distribution"
        description="Breakdown of requests by current status (Click segments for details)"
      >
        {/* Controls */}
        <div className="mb-2 flex gap-2 items-center flex-wrap">
          <button
            onClick={() => {
              setShowStatusTable(!showStatusTable);
              setSelectedSegment(null);
            }}
            className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showStatusTable ? "Chart View" : "Table View"}
          </button>

          {selectedSegment && (
            <>
              <div className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                <strong>{selectedSegment}</strong>
              </div>
              <button
                onClick={() => setSelectedSegment(null)}
                className="px-2 py-0.5 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear
              </button>
              <select
                value={breakdownView}
                onChange={(e) => setBreakdownView(e.target.value)}
                className="px-2 py-0.5 border border-gray-300 rounded text-xs"
              >
                <option value="category">By Category</option>
                <option value="region">By Region</option>
              </select>
            </>
          )}
        </div>

        {!showStatusTable ? (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  onClick={handleSegmentClick}
                  cursor="pointer"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || "#6b7280"}
                      stroke={selectedSegment === entry.name ? "#000" : "none"}
                      strokeWidth={selectedSegment === entry.name ? 3 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                  }}
                />
                <Legend />
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold fill-gray-800"
                >
                  {totalRequests}
                </text>
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm fill-gray-500"
                >
                  Total Requests
                </text>
              </PieChart>
            </ResponsiveContainer>

            {/* Breakdown View when segment is clicked */}
            {selectedSegment && getBreakdownData && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">
                  Breakdown for "{selectedSegment}" by {breakdownView}:
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {breakdownView === "category"
                            ? "Time Period"
                            : "Region"}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getBreakdownData.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            {item.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Note: Full category/region breakdown requires additional data
                  fields in the mock JSON
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statusData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="h-4 w-4 rounded-full mr-2"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[item.name] || "#6b7280",
                          }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((item.value / totalRequests) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartContainer>

      {/* Chart 2: Average Resolution Time by Category with SLA Lines */}
      <ChartContainer
        title="Average Resolution Time by Category"
        description={`SLA Target: ${SLA_TARGET / 24} days |Warning: ${(SLA_WARNING / 24).toFixed(2)} days | Color coding: Green (within SLA), Yellow (approaching SLA), Red (exceeded SLA)`}
      >
        {resolutionData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No resolution data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={resolutionData}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                label={{ value: "Hours", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                width={100}
              />
              <Tooltip
                content={renderTooltip(SLA_TARGET, SLA_WARNING)}
                /*content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    const status =
                      data.avgHours > SLA_TARGET
                        ? "Exceeded SLA"
                        : data.avgHours > SLA_WARNING
                          ? "Approaching SLA"
                          : "Within SLA";
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                        <p className="font-semibold text-gray-800">
                          {data.category}
                        </p>
                        <p className="text-sm text-gray-600">
                          Avg: {data.avgHours} hours ({data.avgDays} days)
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            data.avgHours > SLA_TARGET
                              ? "text-red-600"
                              : data.avgHours > SLA_WARNING
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {status}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }} */
              />

              <Legend />
              {/* SLA Target Line */}
              <ReferenceLine
                x={SLA_TARGET}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: "SLA Target",
                  position: "top",
                  fill: "#ef4444",
                  fontSize: 12,
                }}
              />
              {/* SLA Warning Line */}
              <ReferenceLine
                x={SLA_WARNING}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{
                  value: "Warning",
                  position: "top",
                  fill: "#f59e0b",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="avgHours" radius={[0, 4, 4, 0]} name="Avg Hours">
                {resolutionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getResolutionColor(entry.avgHours)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>
    </div>
  );
};

export default KPIAnalytics;
