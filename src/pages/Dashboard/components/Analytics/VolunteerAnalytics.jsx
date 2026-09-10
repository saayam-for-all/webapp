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
import ChartContainer from "./charts/ChartContainer";
import { getVolunteerApplicationAnalytics } from "../../../../services/analyticsServices";
import { isoAlpha3ToName } from "../../../../utils/isoCountryNames";

// Map UI time range id → API response top-level key
const TREND_KEYS = {
  "7d": "7D",
  "30d": "30D",
  "1yr": "1Y",
  all: "All",
  custom: "Custom",
};

// Format "2026-01" → "Jan 2026"
const formatPeriod = (periodStr) => {
  if (!periodStr) return "";
  const [year, month] = periodStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// Parse volunteer_activity_trend into recharts-ready array with period labels
const parseTrendData = (trendObj) => {
  if (!trendObj) return [];
  const newV = trendObj.new_volunteers ?? [];
  const activeV = trendObj.active_volunteers ?? [];
  const totalV = trendObj.total_volunteers ?? [];

  const periodMap = {};
  newV.forEach(({ period, count }) => {
    if (!periodMap[period]) periodMap[period] = { period };
    periodMap[period].newVolunteers = count;
  });
  activeV.forEach(({ period, count }) => {
    if (!periodMap[period]) periodMap[period] = { period };
    periodMap[period].activeVolunteers = count;
  });
  totalV.forEach(({ period, count }) => {
    if (!periodMap[period]) periodMap[period] = { period };
    periodMap[period].totalVolunteers = count;
  });

  return Object.values(periodMap)
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((item) => ({
      ...item,
      label: formatPeriod(item.period),
    }));
};

// Parse volunteers_by_location into bar-chart array, resolving ISO alpha-3 codes
const parseLocationData = (locationArr) => {
  if (!Array.isArray(locationArr) || locationArr.length === 0) return [];
  return locationArr
    .map(({ country, count }) => ({
      country: isoAlpha3ToName(country) || country,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

const VolunteerAnalytics = () => {
  const [trendRange, setTrendRange] = useState("all");
  const [trendCustomStart, setTrendCustomStart] = useState("");
  const [trendCustomEnd, setTrendCustomEnd] = useState("");

  const [locationRange, setLocationRange] = useState("all");
  const [locationCustomStart, setLocationCustomStart] = useState("");
  const [locationCustomEnd, setLocationCustomEnd] = useState("");

  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [locationApiData, setLocationApiData] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Initial fetch — {} returns all pre-computed windows
  useEffect(() => {
    let cancelled = false;
    const fetchDefault = async () => {
      try {
        setApiLoading(true);
        const data = await getVolunteerApplicationAnalytics({});
        if (!cancelled) {
          setApiData(data);
          setApiError(null);
        }
      } catch (err) {
        console.error("Failed to fetch volunteer analytics:", err);
        if (!cancelled) setApiError(err);
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    };
    fetchDefault();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch custom trend range when both dates are set
  useEffect(() => {
    if (trendRange !== "custom" || !trendCustomStart || !trendCustomEnd) return;
    let cancelled = false;
    const fetchCustom = async () => {
      try {
        setApiLoading(true);
        const data = await getVolunteerApplicationAnalytics({
          start_date: trendCustomStart,
          end_date: trendCustomEnd,
        });
        if (!cancelled) {
          setApiData(data);
          setApiError(null);
        }
      } catch (err) {
        console.error("Failed to fetch custom volunteer trend:", err);
        if (!cancelled) setApiError(err);
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    };
    fetchCustom();
    return () => {
      cancelled = true;
    };
  }, [trendRange, trendCustomStart, trendCustomEnd]);

  // Fetch custom location range — uses different payload keys
  useEffect(() => {
    if (
      locationRange !== "custom" ||
      !locationCustomStart ||
      !locationCustomEnd
    )
      return;
    let cancelled = false;
    const fetchLocationCustom = async () => {
      try {
        setLocationLoading(true);
        const data = await getVolunteerApplicationAnalytics({
          location_start_date: locationCustomStart,
          location_end_date: locationCustomEnd,
        });
        if (!cancelled) setLocationApiData(data);
      } catch {
        if (!cancelled) setLocationApiData(null);
      } finally {
        if (!cancelled) setLocationLoading(false);
      }
    };
    fetchLocationCustom();
    return () => {
      cancelled = true;
    };
  }, [locationRange, locationCustomStart, locationCustomEnd]);

  const trendData = useMemo(() => {
    if (!apiData) return [];
    const body = apiData.body ?? apiData;
    const window = body[TREND_KEYS[trendRange]];
    if (!window) return [];
    return parseTrendData(window.volunteer_activity_trend);
  }, [apiData, trendRange]);

  const locationSource =
    locationRange === "custom" && locationApiData ? locationApiData : apiData;

  const locationData = useMemo(() => {
    if (!locationSource) return [];
    const body = locationSource.body ?? locationSource;
    const window = body[TREND_KEYS[locationRange]];
    if (!window) return [];
    return parseLocationData(window.volunteers_by_location);
  }, [locationSource, locationRange]);

  const TIME_RANGE_BUTTONS = [
    { id: "7d", label: "7D" },
    { id: "30d", label: "30D" },
    { id: "1yr", label: "1Y" },
    { id: "all", label: "All" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Chart 1: Volunteer Activity Trend */}
      <ChartContainer
        title="Volunteer Activity Trend"
        description="New, active, and total volunteers over time"
      >
        <div className="flex gap-1.5 mb-2 flex-wrap items-center">
          {TIME_RANGE_BUTTONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTrendRange(id)}
              className={`px-2 py-0.5 text-xs rounded ${
                trendRange === id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
          {trendRange === "custom" && (
            <>
              <input
                type="date"
                value={trendCustomStart}
                onChange={(e) => setTrendCustomStart(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
              <span className="text-xs text-gray-500">→</span>
              <input
                type="date"
                value={trendCustomEnd}
                onChange={(e) => setTrendCustomEnd(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
            </>
          )}
        </div>

        {apiError && (
          <div className="mb-2 px-3 py-2 text-sm bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            Could not load data. Please try again later.
          </div>
        )}

        {apiLoading ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Loading volunteer data…
          </div>
        ) : trendData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No data available for the selected period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={trendData}
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
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm text-xs">
                        <p className="font-semibold text-gray-800 mb-1">
                          {d.label}
                        </p>
                        <p className="text-orange-600">
                          New: {d.newVolunteers ?? "—"}
                        </p>
                        <p className="text-green-600">
                          Active: {d.activeVolunteers ?? "—"}
                        </p>
                        <p className="text-blue-600">
                          Total: {d.totalVolunteers ?? "—"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="newVolunteers"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", r: 3 }}
                activeDot={{ r: 5 }}
                name="New Volunteers"
              />
              <Line
                type="monotone"
                dataKey="activeVolunteers"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
                activeDot={{ r: 5 }}
                name="Active Volunteers"
              />
              <Line
                type="monotone"
                dataKey="totalVolunteers"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
                activeDot={{ r: 5 }}
                name="Total Volunteers"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* Chart 2: Volunteers by Location */}
      <ChartContainer
        title="Volunteers by Location"
        description="Top 10 countries by volunteer count"
      >
        <div className="flex gap-1.5 mb-2 flex-wrap items-center">
          <span className="text-xs text-gray-500 font-medium">Period:</span>
          {TIME_RANGE_BUTTONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setLocationRange(id)}
              className={`px-2 py-0.5 text-xs rounded ${
                locationRange === id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
          {locationRange === "custom" && (
            <>
              <input
                type="date"
                value={locationCustomStart}
                onChange={(e) => setLocationCustomStart(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
              <span className="text-xs text-gray-500">→</span>
              <input
                type="date"
                value={locationCustomEnd}
                onChange={(e) => setLocationCustomEnd(e.target.value)}
                className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
              />
            </>
          )}
          {locationLoading && (
            <span className="text-xs text-gray-400 italic">Updating…</span>
          )}
        </div>

        {locationData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No data available for the selected period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={locationData}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis
                dataKey="country"
                type="category"
                tick={{ fontSize: 11 }}
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
        )}
      </ChartContainer>
    </div>
  );
};

export default VolunteerAnalytics;
