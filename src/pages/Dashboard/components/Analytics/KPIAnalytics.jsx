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
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import resolutionTimeData from "../../../../data/analytics/kpi_resolution_time_monthly.json";
import statusDistributionData from "../../../../data/analytics/request_status_distribution_monthly.json";

/**
 * KPIAnalytics Component
 *
 * Displays:
 * 1. Average Resolution Time by Category (Horizontal Bar Chart with color grading)
 * 2. Request Status Distribution (Pie/Donut Chart)
 */
const KPIAnalytics = () => {
  // Process resolution time data - calculate average by category
  const processResolutionData = () => {
    const categoryTotals = {};
    const categoryCounts = {};

    resolutionTimeData.forEach((item) => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = 0;
        categoryCounts[item.category] = 0;
      }
      categoryTotals[item.category] += item.avgResolutionHours;
      categoryCounts[item.category]++;
    });

    return Object.entries(categoryTotals)
      .map(([category, total]) => ({
        category,
        avgHours: Math.round(total / categoryCounts[category]),
        avgDays: (total / categoryCounts[category] / 24).toFixed(1),
      }))
      .sort((a, b) => b.avgHours - a.avgHours);
  };

  // Process status distribution - aggregate totals
  const processStatusData = () => {
    const statusTotals = {};

    statusDistributionData.forEach((item) => {
      if (!statusTotals[item.status]) {
        statusTotals[item.status] = 0;
      }
      statusTotals[item.status] += item.requestCount;
    });

    return Object.entries(statusTotals).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const resolutionData = processResolutionData();
  const statusData = processStatusData();

  // Color mapping for resolution time (Red > Yellow > Green based on hours)
  const getResolutionColor = (avgHours) => {
    if (avgHours > 300) return "#ef4444"; // Red - exceeded SLA
    if (avgHours > 200) return "#f59e0b"; // Yellow - approaching SLA
    return "#10b981"; // Green - within SLA
  };

  // Colors for status pie chart
  const STATUS_COLORS = {
    CREATED: "#3b82f6", // Blue
    IN_PROGRESS: "#f59e0b", // Orange
    RESOLVED: "#10b981", // Green
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          ⏱️ KPI Analytics
        </h2>
        <p className="text-sm text-gray-500">
          Performance metrics for request resolution
        </p>
      </div>

      {/* Chart 1: Average Resolution Time by Category */}
      <ChartContainer
        title="Average Resolution Time by Category"
        description="Color coding: Green (within SLA), Yellow (approaching SLA), Red (exceeded SLA)"
      >
        <ResponsiveContainer width="100%" height={400}>
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
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-800">
                        {payload[0].payload.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        Avg: {payload[0].payload.avgHours} hours (
                        {payload[0].payload.avgDays} days)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="avgHours" radius={[0, 4, 4, 0]}>
              {resolutionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getResolutionColor(entry.avgHours)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Chart 2: Request Status Distribution */}
      <ChartContainer
        title="Request Status Distribution"
        description="Breakdown of requests by current status"
      >
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.name] || "#6b7280"}
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
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default KPIAnalytics;
