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
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import beneficiariesGrowthData from "../../../../data/analytics/beneficiaries_growth_monthly.json";
import beneficiariesByCountryData from "../../../../data/analytics/beneficiaries_by_country_monthly.json";

/**
 * BeneficiariesAnalytics Component
 *
 * Displays:
 * 1. Beneficiary Growth Trend (Area Chart) - Monthly new beneficiaries
 * 2. Beneficiaries by Country (Bar Chart) - Geographic distribution
 */
const BeneficiariesAnalytics = () => {
  // Format month for display
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const growthData = beneficiariesGrowthData.map((item) => ({
    ...item,
    monthFormatted: formatMonth(item.month),
  }));

  // Process country data - aggregate totals by country
  const processCountryData = () => {
    const countryTotals = {};

    beneficiariesByCountryData.forEach((item) => {
      if (!countryTotals[item.country]) {
        countryTotals[item.country] = 0;
      }
      countryTotals[item.country] += item.beneficiaryCount;
    });

    return Object.entries(countryTotals)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 countries
  };

  const countryData = processCountryData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          👥 Beneficiaries Analytics
        </h2>
        <p className="text-sm text-gray-500">
          Growth and distribution of beneficiaries
        </p>
      </div>

      {/* Chart 1: Beneficiary Growth Trend */}
      <ChartContainer
        title="Beneficiary Growth Trend"
        description="Monthly new beneficiary registrations"
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={growthData}>
            <defs>
              <linearGradient
                id="colorBeneficiaries"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="newBeneficiaries"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBeneficiaries)"
              name="New Beneficiaries"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Chart 2: Beneficiaries by Country */}
      <ChartContainer
        title="Beneficiaries by Country"
        description="Top 10 countries by beneficiary count"
      >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={countryData} layout="vertical" margin={{ left: 20 }}>
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
      </ChartContainer>
    </div>
  );
};

export default BeneficiariesAnalytics;
