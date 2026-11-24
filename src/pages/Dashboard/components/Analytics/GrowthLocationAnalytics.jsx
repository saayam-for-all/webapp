import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
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
  LabelList,
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import { getGrowthTrendAnalytics } from "../../../../services/analyticsServices";
import { isoAlpha3ToName } from "../../../../utils/isoCountryNames";
import {
  unwrapBody,
  parseGrowthTrend,
  parseLocation,
} from "./growthLocationUtils";

// Map UI time range id → API response top-level key
const WINDOW_KEYS = {
  "7d": "7D",
  "30d": "30D",
  "1yr": "1Y",
  all: "All",
  custom: "Custom",
};

const TIME_RANGE_BUTTONS = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "1yr", label: "1Y" },
  { id: "all", label: "All" },
  { id: "custom", label: "Custom" },
];

const ORG_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "non_profit", label: "Non-Profit" },
  { value: "for_profit", label: "For-Profit" },
];

const PeriodSelector = ({
  range,
  setRange,
  start,
  setStart,
  end,
  setEnd,
  testIdPrefix,
}) => (
  <div className="flex gap-1.5 mb-2 flex-wrap items-center">
    <span className="text-xs text-gray-500 font-medium">Period:</span>
    {TIME_RANGE_BUTTONS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
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
          data-testid={`${testIdPrefix}-start`}
          value={start}
          max={end || undefined}
          onChange={(e) => setStart(e.target.value)}
          className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
        />
        <span className="text-xs text-gray-500">→</span>
        <input
          type="date"
          aria-label="End date"
          data-testid={`${testIdPrefix}-end`}
          value={end}
          min={start || undefined}
          onChange={(e) => setEnd(e.target.value)}
          className="px-1.5 py-0.5 border border-gray-300 rounded text-xs"
        />
      </>
    )}
  </div>
);

PeriodSelector.propTypes = {
  range: PropTypes.string.isRequired,
  setRange: PropTypes.func.isRequired,
  start: PropTypes.string.isRequired,
  setStart: PropTypes.func.isRequired,
  end: PropTypes.string.isRequired,
  setEnd: PropTypes.func.isRequired,
  testIdPrefix: PropTypes.string.isRequired,
};

// Shared fetch helper: parses body and surfaces API-level `error` messages
const runFetch = (payload, { setData, setLoading, setError }) => {
  let cancelled = false;
  (async () => {
    try {
      setLoading(true);
      const response = await getGrowthTrendAnalytics(payload);
      if (cancelled) return;
      const body = unwrapBody(response);
      if (!body || body.error) {
        setData(null);
        setError(body?.error || "Could not load data.");
      } else {
        setData(body);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to fetch growth & location analytics:", err);
      if (!cancelled) {
        setData(null);
        setError("Could not load data. Please try again later.");
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  })();
  return () => {
    cancelled = true;
  };
};

const isValidRange = (start, end) => Boolean(start && end && start <= end);

const GrowthLocationAnalytics = () => {
  // Shared filters (sent to every request)
  const [orgType, setOrgType] = useState("");
  const [country, setCountry] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);

  // Growth trend period
  const [trendRange, setTrendRange] = useState("all");
  const [trendStart, setTrendStart] = useState("");
  const [trendEnd, setTrendEnd] = useState("");

  // Location period
  const [locationRange, setLocationRange] = useState("all");
  const [locationStart, setLocationStart] = useState("");
  const [locationEnd, setLocationEnd] = useState("");

  // Default ({} + filters) response — holds all pre-computed windows
  const [defaultData, setDefaultData] = useState(null);
  const [defaultLoading, setDefaultLoading] = useState(true);
  const [defaultError, setDefaultError] = useState(null);

  const [trendCustomData, setTrendCustomData] = useState(null);
  const [trendCustomLoading, setTrendCustomLoading] = useState(false);
  const [trendCustomError, setTrendCustomError] = useState(null);

  const [locationCustomData, setLocationCustomData] = useState(null);
  const [locationCustomLoading, setLocationCustomLoading] = useState(false);
  const [locationCustomError, setLocationCustomError] = useState(null);

  const filters = useMemo(() => {
    const f = {};
    if (orgType) f.organization_type = orgType;
    if (country) f.country = country;
    return f;
  }, [orgType, country]);

  useEffect(
    () =>
      runFetch(filters, {
        setData: setDefaultData,
        setLoading: setDefaultLoading,
        setError: setDefaultError,
      }),
    [filters],
  );

  useEffect(() => {
    if (trendRange !== "custom" || !isValidRange(trendStart, trendEnd)) return;
    return runFetch(
      { ...filters, start_date: trendStart, end_date: trendEnd },
      {
        setData: setTrendCustomData,
        setLoading: setTrendCustomLoading,
        setError: setTrendCustomError,
      },
    );
  }, [filters, trendRange, trendStart, trendEnd]);

  useEffect(() => {
    if (locationRange !== "custom" || !isValidRange(locationStart, locationEnd))
      return;
    return runFetch(
      {
        ...filters,
        location_start_date: locationStart,
        location_end_date: locationEnd,
      },
      {
        setData: setLocationCustomData,
        setLoading: setLocationCustomLoading,
        setError: setLocationCustomError,
      },
    );
  }, [filters, locationRange, locationStart, locationEnd]);

  // Country dropdown options: taken from the unfiltered "All" window once, so
  // they don't shrink when a country filter is applied.
  useEffect(() => {
    if (countryOptions.length > 0 || country || !defaultData) return;
    const locations = defaultData?.All?.organizations_by_location;
    if (!Array.isArray(locations) || locations.length === 0) return;
    setCountryOptions(
      locations
        .map(({ country: code }) => ({
          value: code,
          label: isoAlpha3ToName(code) || code,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    );
  }, [defaultData, country, countryOptions.length]);

  const trendIsCustom = trendRange === "custom";
  const trendSource = trendIsCustom ? trendCustomData : defaultData;
  const trendLoading = trendIsCustom ? trendCustomLoading : defaultLoading;
  const trendError = trendIsCustom ? trendCustomError : defaultError;
  const trendNeedsDates = trendIsCustom && !isValidRange(trendStart, trendEnd);

  const trendData = useMemo(() => {
    if (!trendSource || trendNeedsDates) return [];
    return parseGrowthTrend(trendSource[WINDOW_KEYS[trendRange]]?.growth_trend);
  }, [trendSource, trendRange, trendNeedsDates]);

  const locationIsCustom = locationRange === "custom";
  const locationSource = locationIsCustom ? locationCustomData : defaultData;
  const locationLoading = locationIsCustom
    ? locationCustomLoading
    : defaultLoading;
  const locationError = locationIsCustom ? locationCustomError : defaultError;
  const locationNeedsDates =
    locationIsCustom && !isValidRange(locationStart, locationEnd);

  const locationData = useMemo(() => {
    if (!locationSource || locationNeedsDates) return [];
    return parseLocation(
      locationSource[WINDOW_KEYS[locationRange]]?.organizations_by_location,
    );
  }, [locationSource, locationRange, locationNeedsDates]);

  const hasFilters = Boolean(orgType || country);

  const renderStatus = ({ loading, error, needsDates, empty, label }) => {
    if (needsDates)
      return (
        <div className="flex items-center justify-center h-56 text-gray-400 text-sm">
          Select a valid start and end date.
        </div>
      );
    if (loading)
      return (
        <div className="flex items-center justify-center h-56 text-gray-500 text-sm">
          Loading {label}…
        </div>
      );
    if (error)
      return (
        <div className="flex items-center justify-center h-56">
          <div className="px-3 py-2 text-sm bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            {error}
          </div>
        </div>
      );
    if (empty)
      return (
        <div className="flex items-center justify-center h-56 text-gray-400 text-sm">
          No data available for the selected period.
        </div>
      );
    return null;
  };

  const trendStatus = renderStatus({
    loading: trendLoading,
    error: trendError,
    needsDates: trendNeedsDates,
    empty: trendData.length === 0,
    label: "growth trend",
  });

  const locationStatus = renderStatus({
    loading: locationLoading,
    error: locationError,
    needsDates: locationNeedsDates,
    empty: locationData.length === 0,
    label: "location data",
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 mb-3 text-left">
        <label className="flex flex-col text-xs text-gray-500 font-medium">
          Organization Type
          <select
            aria-label="Organization Type"
            value={orgType}
            onChange={(e) => setOrgType(e.target.value)}
            className="mt-1 px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 bg-white"
          >
            {ORG_TYPE_OPTIONS.map(({ value, label }) => (
              <option key={value || "all"} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs text-gray-500 font-medium">
          Country
          <select
            aria-label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 bg-white"
          >
            <option value="">All Countries</option>
            {countryOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setOrgType("");
            setCountry("");
          }}
          disabled={!hasFilters}
          className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Growth Trend */}
        <ChartContainer
          title="Growth Trend"
          description="Organizations onboarded over time"
        >
          <PeriodSelector
            range={trendRange}
            setRange={setTrendRange}
            start={trendStart}
            setStart={setTrendStart}
            end={trendEnd}
            setEnd={setTrendEnd}
            testIdPrefix="trend"
          />
          {trendStatus || (
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
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  allowDecimals={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="totalOrganizations"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Total Organizations"
                />
                <Line
                  type="monotone"
                  dataKey="collaborators"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Total Collaborators"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        {/* Chart 2: Organizations by Location */}
        <ChartContainer
          title="Organizations by Location"
          description="Where organizations are concentrated (top 10 countries)"
        >
          <PeriodSelector
            range={locationRange}
            setRange={setLocationRange}
            start={locationStart}
            setStart={setLocationStart}
            end={locationEnd}
            setEnd={setLocationEnd}
            testIdPrefix="location"
          />
          {locationStatus || (
            <ResponsiveContainer
              width="100%"
              height={Math.max(220, locationData.length * 28 + 60)}
            >
              <BarChart
                data={locationData}
                layout="vertical"
                margin={{ left: 10, right: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="country"
                  type="category"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  width={120}
                  interval={0}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: 12,
                  }}
                  formatter={(value, _name, item) => [
                    `${value} (${item?.payload?.percentage ?? 0}%)`,
                    "Organizations",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  name="Organizations"
                  radius={[0, 4, 4, 0]}
                >
                  <LabelList
                    dataKey="count"
                    position="right"
                    style={{ fontSize: 11, fill: "#374151" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default GrowthLocationAnalytics;
