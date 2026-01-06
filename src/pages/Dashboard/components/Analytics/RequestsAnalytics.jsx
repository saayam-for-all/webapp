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
import requestsVolumeData from "../../../../data/analytics/requests_volume_monthly.json";
import requestsByCategoryRegionData from "../../../../data/analytics/requests_by_category_region_monthly.json";

/**
 * RequestsAnalytics Component
 *
 * Displays:
 * 1. Request Volume Trend (Line Chart) - Monthly request counts
 * 2. Request by Category & Region (Stacked Bar Chart) - Category distribution by country
 */
const RequestsAnalytics = () => {
  // Process data for category/region chart - aggregate by category
  const processCategoryData = () => {
    const categoryTotals = {};
    requestsByCategoryRegionData.forEach((item) => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = 0;
      }
      categoryTotals[item.category] += item.requestCount;
    });

    return Object.entries(categoryTotals)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  };

  const categoryData = processCategoryData();

  // Format month for display (e.g., "2025-01" -> "Jan 2025")
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const volumeData = requestsVolumeData.map((item) => ({
    ...item,
    monthFormatted: formatMonth(item.month),
  }));

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

      {/* Chart 1: Request Volume Trend */}
      <ChartContainer
        title="Request Volume Trend"
        description="Total number of requests submitted per month"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="monthFormatted"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
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
              dataKey="requestCount"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
              name="Requests"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Chart 2: Request by Category */}
      <ChartContainer
        title="Requests by Category"
        description="Distribution of requests across different categories"
      >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
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
            <Bar
              dataKey="count"
              fill="#10b981"
              name="Total Requests"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default RequestsAnalytics;
