import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import { getSizeContributionAnalytics } from "../../../../services/analyticsServices";

// Map UI time range id -> API response top-level key
const RANGE_KEYS = {
  "7d": "7D",
  "30d": "30D",
  "1yr": "1Y",
  all: "All",
  custom: "Custom",
};

const TIME_RANGE_BUTTONS = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "1yr", label: "1 Year" },
  { id: "all", label: "All" },
  { id: "custom", label: "Custom" },
];

const SIZE_ORDER = ["small", "medium", "large"];
const DONUT_COLORS = ["#3b82f6", "#10b981"];

// API response shape (POST {} returns every preset window):
// {
//   "<7D|30D|1Y|All>": {
//     organizations_by_size: [{ size: "small", count: 122 }, ...],
//     collaborator_vs_contributor: [
//       { type: "Collaborator", count: 125, percentage: 31.2 }, ...
//     ]
//   }
// }
// The payload may also be wrapped in a `body` key. `percentage` is relative to
// total organizations, so the two slices need not add up to 100%.
const capitalize = (s) =>
  s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : "";

const parseSizeData = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(({ size, count }) => ({
      size: capitalize(size),
      count: Number(count) || 0,
    }))
    .sort((a, b) => {
      const ai = SIZE_ORDER.indexOf(a.size.toLowerCase());
      const bi = SIZE_ORDER.indexOf(b.size.toLowerCase());
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
};

const parseContributionData = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(({ type, count, percentage }) => ({
      name: type,
      value: Number(count) || 0,
      percentage: percentage == null ? null : Number(percentage),
    }))
    .filter((s) => s.value > 0);
};

// Pick one period's data. A custom-range response may come back under a
// "Custom" key or unwrapped, so accept both.
const selectWindow = (data, key) => {
  if (!data) return null;
  const body = data.body ?? data;
  if (body[key]) return body[key];
  if (key === "Custom" && body.organizations_by_size) return body;
  return null;
};

const SizeContributionAnalytics = () => {
  const [range, setRange] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [apiData, setApiData] = useState(null);
  const [customData, setCustomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial fetch - {} returns all pre-computed windows
  useEffect(() => {
    let cancelled = false;
    const fetchDefault = async () => {
      try {
        setLoading(true);
        const data = await getSizeContributionAnalytics({});
        if (!cancelled) {
          setApiData(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch size & contribution analytics:", err);
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchDefault();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch custom range once both dates are set
  useEffect(() => {
    if (range !== "custom" || !customStart || !customEnd) return;
    let cancelled = false;
    const fetchCustom = async () => {
      try {
        setLoading(true);
        const data = await getSizeContributionAnalytics({
          start_date: customStart,
          end_date: customEnd,
        });
        if (!cancelled) {
          setCustomData(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch custom size & contribution data:", err);
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCustom();
    return () => {
      cancelled = true;
    };
  }, [range, customStart, customEnd]);

  const windowData = useMemo(
    () =>
      selectWindow(
        range === "custom" ? customData : apiData,
        RANGE_KEYS[range],
      ),
    [apiData, customData, range],
  );

  const sizeData = useMemo(
    () => parseSizeData(windowData?.organizations_by_size),
    [windowData],
  );
  const contributionSlices = useMemo(
    () => parseContributionData(windowData?.collaborator_vs_contributor),
    [windowData],
  );
  // Percentages are relative to all organizations, so the centre total is the
  // sum of size bands; fall back to the slice sum if size data is missing.
  const totalOrgs =
    sizeData.reduce((sum, d) => sum + d.count, 0) ||
    contributionSlices.reduce((sum, s) => sum + s.value, 0);

  const renderBody = (isEmpty, chart) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading organization data…
        </div>
      );
    }
    if (isEmpty) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          No data available for the selected period.
        </div>
      );
    }
    return chart;
  };

  return (
    <div>
      <div className="flex gap-1.5 mb-3 flex-wrap items-center">
        <span className="text-xs text-gray-500 font-medium">Date Range:</span>
        {TIME_RANGE_BUTTONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setRange(id)}
            className={`px-2 py-0.5 text-xs rounded ${
              range === id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
        {range === "custom" && (
          <>
            <input
              type="date"
              aria-label="Start date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
            />
            <span className="text-xs text-gray-500">→</span>
            <input
              type="date"
              aria-label="End date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
            />
          </>
        )}
      </div>

      {error && (
        <div className="mb-2 px-3 py-2 text-sm bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
          Could not load data. Please try again later.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <ChartContainer
          title="Organizations by Size"
          description="Headcount band distribution"
        >
          {renderBody(
            sizeData.length === 0,
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={sizeData}
                margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="size"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  label={{
                    value: "Organization Size",
                    position: "insideBottomRight",
                    offset: -12,
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  label={{
                    value: "Organization Count",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    fontSize: 11,
                    fill: "#6b7280",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  name="Organizations"
                  maxBarSize={48}
                  radius={[4, 4, 0, 0]}
                  label={{ position: "top", fontSize: 11, fontWeight: 600 }}
                />
              </BarChart>
            </ResponsiveContainer>,
          )}
        </ChartContainer>

        <ChartContainer
          title="Collaborator vs Contributor"
          description="Share of organizations actively collaborating"
        >
          {renderBody(
            contributionSlices.length === 0,
            <div className="flex items-center justify-center gap-6 h-[220px]">
              {/* Donut with the total centred inside the ring */}
              <div className="relative w-[180px] h-[180px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contributionSlices}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      startAngle={90}
                      endAngle={-270}
                      stroke="#fff"
                    >
                      {contributionSlices.map((s, i) => (
                        <Cell
                          key={s.name}
                          fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500">Total Orgs</span>
                  <span className="text-xl font-bold text-gray-800">
                    {totalOrgs}
                  </span>
                </div>
              </div>

              {/* Legend: dot, name, bold count, grey percentage */}
              <ul className="space-y-3 text-sm">
                {contributionSlices.map((s, i) => {
                  const pct =
                    s.percentage ??
                    (totalOrgs ? (s.value / totalOrgs) * 100 : 0);
                  return (
                    <li key={s.name}>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              DONUT_COLORS[i % DONUT_COLORS.length],
                          }}
                        />
                        {s.name}
                      </div>
                      <div className="pl-[18px]">
                        <span className="font-bold text-gray-800">
                          {s.value}
                        </span>{" "}
                        <span className="text-xs text-gray-500">
                          ({pct.toFixed(1)}%)
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>,
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default SizeContributionAnalytics;
