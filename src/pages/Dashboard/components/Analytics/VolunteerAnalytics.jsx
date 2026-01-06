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
import volunteersActivityData from "../../../../data/analytics/volunteers_activity_monthly.json";
import volunteersLocationData from "../../../../data/analytics/volunteers_by_location.json";

/**
 * VolunteerAnalytics Component
 *
 * Displays:
 * 1. Volunteer Activity Trend (Line Chart) - Monthly new volunteers
 * 2. Volunteers by Location (Bar Chart) - Geographic distribution
 */
const VolunteerAnalytics = () => {
  // Format month for display
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const activityData = volunteersActivityData.map((item) => ({
    ...item,
    monthFormatted: formatMonth(item.month),
  }));

  // Process location data - aggregate by country and get top 10
  const processLocationData = () => {
    const countryTotals = {};

    volunteersLocationData.forEach((item) => {
      if (!countryTotals[item.country_name]) {
        countryTotals[item.country_name] = 0;
      }
      countryTotals[item.country_name]++;
    });

    return Object.entries(countryTotals)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 countries
  };

  const locationData = processLocationData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          🙋 Volunteer Analytics
        </h2>
        <p className="text-sm text-gray-500">
          Volunteer activity and geographic distribution
        </p>
      </div>

      {/* Chart 1: Volunteer Activity Trend */}
      <ChartContainer
        title="Volunteer Activity Trend"
        description="Monthly new volunteer registrations"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activityData}>
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
              dataKey="newVolunteers"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", r: 4 }}
              activeDot={{ r: 6 }}
              name="New Volunteers"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Chart 2: Volunteers by Location */}
      <ChartContainer
        title="Volunteers by Location"
        description="Top 10 countries by volunteer count"
      >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={locationData} layout="vertical" margin={{ left: 20 }}>
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
              fill="#f59e0b"
              name="Volunteers"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default VolunteerAnalytics;
