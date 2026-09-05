import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
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
  LabelList,
  ResponsiveContainer,
} from "recharts";
import ChartContainer from "./charts/ChartContainer";
import {
  getOrganizationAnalytics,
  DATE_RANGES,
  REGIONS,
  ORG_TYPES,
  ORG_SERIES,
  RATING_RAMP,
  RATING_STAR_COLORS,
} from "./organizationData";

const SURFACE = "#ffffff";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "performance", label: "Performance" },
  { id: "distribution", label: "Distribution" },
];

const DEFAULT_FILTERS = { dateRange: "12m", region: "All", orgType: "All" };

const GROWTH_LEGEND = [
  { value: "Total Organizations", type: "line", color: ORG_SERIES.total },
  { value: "Active Organizations", type: "line", color: ORG_SERIES.active },
  { value: "Collaborator Orgs", type: "line", color: ORG_SERIES.collaborator },
];

const SPLIT_LEGEND = [
  { value: "Collaborator", type: "square", color: ORG_SERIES.total },
  {
    value: "Contributor (Non-Collaborator)",
    type: "square",
    color: ORG_SERIES.active,
  },
];

const PROFIT_LEGEND = [
  { value: "Profit Organizations", type: "square", color: ORG_SERIES.total },
  {
    value: "Non-Profit Organizations",
    type: "square",
    color: ORG_SERIES.active,
  },
];

/* ── KPI tile icons ── */
const iconProps = {
  className: "h-5 w-5",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.8,
  xmlns: "http://www.w3.org/2000/svg",
};

const BuildingIcon = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h9a.75.75 0 0 1 .75.75V21H3.75V3.75A.75.75 0 0 1 4.5 3Zm9.75 6h5.25a.75.75 0 0 1 .75.75V21h-6V9ZM6.75 6.75h3m-3 3h3m-3 3h3m-3 3h3"
    />
  </svg>
);

const UsersIcon = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.4 9.4 0 0 0 2.625.372 9.3 9.3 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.3 12.3 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
);

const HandshakeIcon = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.97 8.97 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A9 9 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.97 8.97 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A9 9 0 0 0 18 18a8.97 8.97 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);

const StarIcon = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11a.56.56 0 0 0 .48.34l5.52.44c.5.04.7.67.32 1l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.39c.12.49-.41.88-.83.61l-4.73-2.89a.56.56 0 0 0-.58 0l-4.73 2.89c-.43.27-.96-.12-.83-.61l1.28-5.39a.56.56 0 0 0-.18-.56l-4.2-3.6c-.38-.33-.18-.96.32-1l5.52-.44a.56.56 0 0 0 .48-.34L11.48 3.5Z"
    />
  </svg>
);

const CurrencyIcon = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const ResetIcon = () => (
  <svg {...iconProps} className="h-4 w-4">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992V4.356m-.001 0-3.181 3.183a8.25 8.25 0 0 0-13.803 3.7M4.031 9.865v4.992m0 0h4.99m-4.99 0 3.181 3.183a8.25 8.25 0 0 0 13.804-3.7"
    />
  </svg>
);

const ChevronIcon = ({ direction }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={
        direction === "prev"
          ? "M15.75 19.5 8.25 12l7.5-7.5"
          : "m8.25 4.5 7.5 7.5-7.5 7.5"
      }
    />
  </svg>
);

ChevronIcon.propTypes = { direction: PropTypes.oneOf(["prev", "next"]) };

const formatCurrency = (value) =>
  value >= 1_000_000
    ? `$${(value / 1_000_000).toFixed(2)}M`
    : `$${(value / 1000).toFixed(0)}K`;

/* ── KPI tile ── */
const KpiTile = ({ icon, iconClass, label, value, suffix, change }) => (
  <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3 text-left">
    <div
      className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg ${iconClass}`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
      <p className="text-xl font-bold text-gray-800 leading-tight">
        {value}
        {suffix && (
          <span className="text-sm font-normal text-gray-400">{suffix}</span>
        )}
      </p>
      <p
        className={`text-[11px] ${change < 0 ? "text-rose-600" : "text-emerald-600"}`}
      >
        {change < 0 ? "↓" : "↑"} {Math.abs(change)}% vs period start
      </p>
    </div>
  </div>
);

KpiTile.propTypes = {
  icon: PropTypes.node.isRequired,
  iconClass: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suffix: PropTypes.string,
  change: PropTypes.number,
};

/* ── Shared tooltip ── */
const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white p-2.5 border border-gray-200 rounded-lg shadow-sm text-left">
      <p className="font-semibold text-gray-800 text-xs mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey ?? entry.name} className="text-xs text-gray-600">
          <span
            className="inline-block h-2 w-2 rounded-sm mr-1.5 align-middle"
            style={{ backgroundColor: entry.color || entry.payload?.fill }}
          />
          {entry.name}:{" "}
          <span className="font-semibold text-gray-800">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formatter: PropTypes.func,
};

/* Recharts v3 re-sorts its own legend payload, so the legend is rendered here
   to keep its order matching the order the series are drawn in. */
const ChartLegend = ({ items }) => (
  <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-1">
    {items.map((item) => (
      <li key={item.value} className="flex items-center gap-1.5">
        <span
          className={`flex-shrink-0 ${item.type === "line" ? "h-0.5 w-3.5 rounded-full" : "h-2.5 w-2.5 rounded-sm"}`}
          style={{ backgroundColor: item.color }}
        />
        <span className="text-xs text-gray-600">{item.value}</span>
      </li>
    ))}
  </ul>
);

ChartLegend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      type: PropTypes.string,
      color: PropTypes.string,
    }),
  ).isRequired,
};

const axisTick = { fontSize: 11, fill: "#6b7280" };

// Column definitions backing each chart's table view and CSV export.
const EXPORT_COLUMNS = {
  growthTrend: [
    { key: "month", label: "Month" },
    { key: "total", label: "Total Organizations" },
    { key: "active", label: "Active Organizations" },
    { key: "collaborator", label: "Collaborator Orgs" },
  ],
  byLocation: [
    { key: "location", label: "Location" },
    { key: "organizations", label: "Organizations" },
    { key: "percent", label: "% of Total" },
  ],
  bySize: [
    { key: "size", label: "Size" },
    { key: "organizations", label: "Organizations" },
  ],
  collaboratorSplit: [
    { key: "name", label: "Type" },
    { key: "value", label: "Organizations" },
  ],
  byRating: [
    { key: "rating", label: "Rating" },
    { key: "organizations", label: "Organizations" },
  ],
  profitTrend: [
    { key: "month", label: "Month" },
    { key: "profit", label: "Profit Organizations" },
    { key: "nonProfit", label: "Non-Profit Organizations" },
  ],
};

/* Rating axis tick — a coloured star beside the label, so the ordinal scale
   reads at a glance without repeating itself in a second row. */
const RatingTick = ({ x, y, payload, index }) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={12} textAnchor="middle" fontSize={11} fill="#6b7280">
      <tspan fill={RATING_STAR_COLORS[index]}>★</tspan>
      <tspan dx={4}>{payload.value}</tspan>
    </text>
  </g>
);

RatingTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
  index: PropTypes.number,
};

const OrganizationAnalytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const data = useMemo(() => getOrganizationAnalytics(filters), [filters]);
  const { kpis } = data;

  const setFilter = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const tabIndex = TABS.findIndex((t) => t.id === activeTab);

  const goToTab = (step) => {
    const next = TABS[tabIndex + step];
    if (next) setActiveTab(next.id);
  };

  const isFiltered =
    filters.dateRange !== DEFAULT_FILTERS.dateRange ||
    filters.region !== DEFAULT_FILTERS.region ||
    filters.orgType !== DEFAULT_FILTERS.orgType;

  const collaboratorTotal = data.collaboratorSplit.reduce(
    (sum, s) => sum + s.value,
    0,
  );

  const selectClass =
    "px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="px-3 pb-3 pt-1 bg-gray-50">
      {/* ── Title + filters ── */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
        <div className="text-left">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">
            ORGANIZATION DASHBOARD
          </h2>
          <p className="text-xs text-gray-500">
            Overview of organization performance and impact
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col text-left">
            <span className="text-[11px] font-medium text-gray-500 mb-0.5">
              Date Range
            </span>
            <select
              value={filters.dateRange}
              onChange={setFilter("dateRange")}
              className={selectClass}
            >
              {DATE_RANGES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-left">
            <span className="text-[11px] font-medium text-gray-500 mb-0.5">
              Region
            </span>
            <select
              value={filters.region}
              onChange={setFilter("region")}
              className={selectClass}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-left">
            <span className="text-[11px] font-medium text-gray-500 mb-0.5">
              Organization Type
            </span>
            <select
              value={filters.orgType}
              onChange={setFilter("orgType")}
              className={selectClass}
            >
              {ORG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            disabled={!isFiltered}
            className="flex items-center gap-1 px-2.5 py-1 border border-gray-300 rounded text-xs bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white"
          >
            <ResetIcon />
            Reset
          </button>
        </div>
      </div>

      {/* ── KPI tiles ── */}
      <div
        aria-label="Key metrics"
        className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-3"
      >
        <KpiTile
          icon={<BuildingIcon />}
          iconClass="bg-blue-50 text-blue-600"
          label="Total Organizations"
          value={kpis.totalOrganizations}
          change={kpis.change.totalOrganizations}
        />
        <KpiTile
          icon={<UsersIcon />}
          iconClass="bg-emerald-50 text-emerald-600"
          label="Active Organizations"
          value={kpis.activeOrganizations}
          change={kpis.change.activeOrganizations}
        />
        <KpiTile
          icon={<HandshakeIcon />}
          iconClass="bg-violet-50 text-violet-600"
          label="Collaborator Orgs"
          value={kpis.collaboratorOrgs}
          change={kpis.change.collaboratorOrgs}
        />
        <KpiTile
          icon={<StarIcon />}
          iconClass="bg-amber-50 text-amber-500"
          label="Avg. Org Rating"
          value={kpis.avgRating}
          suffix=" / 5"
          change={kpis.change.avgRating}
        />
        <KpiTile
          icon={<CurrencyIcon />}
          iconClass="bg-rose-50 text-rose-600"
          label="Total Profit (Orgs)"
          value={formatCurrency(kpis.totalProfit)}
          change={kpis.change.totalProfit}
        />
      </div>

      {/* ── Sub-tab bar, with arrows for stepping through the tabs ── */}
      <div className="flex items-stretch mb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-1.5 text-sm text-center cursor-pointer border-b-2 font-semibold mr-1
              ${
                activeTab === tab.id
                  ? "bg-white text-blue-500 border-blue-500"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex items-center gap-1 pl-1">
          <button
            onClick={() => goToTab(-1)}
            disabled={tabIndex === 0}
            title="Previous tab"
            aria-label="Previous tab"
            className="p-1 rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500"
          >
            <ChevronIcon direction="prev" />
          </button>
          <button
            onClick={() => goToTab(1)}
            disabled={tabIndex === TABS.length - 1}
            title="Next tab"
            aria-label="Next tab"
            className="p-1 rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500"
          >
            <ChevronIcon direction="next" />
          </button>
        </div>
      </div>

      {/* ── Tab 1: Overview ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-4">
          <ChartContainer
            title="1. Growth Trend (Line Chart)"
            description="Organizations onboarded over time"
            exportData={{
              filename: "growth-trend",
              legend: GROWTH_LEGEND,
              columns: EXPORT_COLUMNS.growthTrend,
              rows: data.growthTrend,
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={data.growthTrend}
                margin={{ top: 8, right: 12, bottom: 4, left: -12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={axisTick} stroke="#9ca3af" />
                <YAxis tick={axisTick} stroke="#9ca3af" />
                <Tooltip content={<ChartTooltip />} />
                <Legend content={<ChartLegend items={GROWTH_LEGEND} />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total Organizations"
                  stroke={ORG_SERIES.total}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, stroke: SURFACE }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  name="Active Organizations"
                  stroke={ORG_SERIES.active}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, stroke: SURFACE }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="collaborator"
                  name="Collaborator Orgs"
                  stroke={ORG_SERIES.collaborator}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, stroke: SURFACE }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="2. Organizations by Location (Bar Chart)"
            description="Where organizations are concentrated"
            exportData={{
              filename: "organizations-by-location",
              columns: EXPORT_COLUMNS.byLocation,
              rows: data.byLocation,
            }}
          >
            {/* Column header. The percent label floats after each value rather
                than in a fixed column, so it is named inline instead. */}
            <div className="flex items-center text-[11px] font-medium text-gray-500 pb-1 border-b border-gray-100">
              <span className="w-[90px] text-right pr-2">Location</span>
              <span className="flex-1 text-left">
                Organizations{" "}
                <span className="font-normal text-gray-400">
                  (count · % of total)
                </span>
              </span>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart
                data={data.byLocation}
                layout="vertical"
                margin={{ top: 8, right: 64, bottom: 4, left: 0 }}
                barCategoryGap="22%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  horizontal={false}
                />
                <XAxis type="number" tick={axisTick} stroke="#9ca3af" />
                <YAxis
                  type="category"
                  dataKey="location"
                  width={90}
                  tick={axisTick}
                  stroke="#9ca3af"
                />
                <Tooltip
                  cursor={{ fill: "rgba(59,130,246,0.06)" }}
                  content={<ChartTooltip />}
                />
                <Bar
                  dataKey="organizations"
                  name="Organizations"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                >
                  {data.byLocation.map((row) => (
                    <Cell
                      key={row.location}
                      fill={
                        row.location === "Other"
                          ? ORG_SERIES.other
                          : ORG_SERIES.total
                      }
                    />
                  ))}
                  <LabelList
                    dataKey="organizations"
                    position="right"
                    style={{ fontSize: 11, fill: "#374151", fontWeight: 600 }}
                  />
                  <LabelList
                    dataKey="percent"
                    position="right"
                    offset={30}
                    formatter={(v) => `${v}%`}
                    style={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}

      {/* ── Tab 2: Performance ── */}
      {activeTab === "performance" && (
        <div className="grid grid-cols-2 gap-4">
          <ChartContainer
            title="3. Organizations by Size (Bar Chart)"
            description="Headcount band distribution"
            exportData={{
              filename: "organizations-by-size",
              columns: EXPORT_COLUMNS.bySize,
              rows: data.bySize,
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={data.bySize}
                margin={{ top: 20, right: 12, bottom: 4, left: -12 }}
                barCategoryGap="34%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="size" tick={axisTick} stroke="#9ca3af" />
                <YAxis tick={axisTick} stroke="#9ca3af" />
                <Tooltip
                  cursor={{ fill: "rgba(59,130,246,0.06)" }}
                  content={<ChartTooltip />}
                />
                <Bar
                  dataKey="organizations"
                  name="Organizations"
                  fill={ORG_SERIES.total}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={72}
                >
                  <LabelList
                    dataKey="organizations"
                    position="top"
                    style={{ fontSize: 12, fill: "#374151", fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="4. Collaborator vs Contributor (Donut Chart)"
            description="Share of organizations actively collaborating"
            exportData={{
              filename: "collaborator-vs-contributor",
              legend: SPLIT_LEGEND,
              columns: EXPORT_COLUMNS.collaboratorSplit,
              rows: data.collaboratorSplit,
            }}
          >
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={240}>
                <PieChart>
                  <Pie
                    data={data.collaboratorSplit}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={92}
                    dataKey="value"
                    stroke={SURFACE}
                    strokeWidth={2}
                  >
                    {data.collaboratorSplit.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          index === 0 ? ORG_SERIES.total : ORG_SERIES.active
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <ChartTooltip
                        formatter={(v) =>
                          `${v} (${collaboratorTotal > 0 ? ((v / collaboratorTotal) * 100).toFixed(1) : 0}%)`
                        }
                      />
                    }
                  />
                  <text
                    x="50%"
                    y="46%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-500"
                  >
                    Total Organizations
                  </text>
                  <text
                    x="50%"
                    y="56%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold fill-gray-800"
                  >
                    {collaboratorTotal}
                  </text>
                </PieChart>
              </ResponsiveContainer>

              {/* Direct labels stand in for a legend box — identity is never colour alone */}
              <ul className="flex-1 space-y-3 text-left">
                {data.collaboratorSplit.map((entry, index) => (
                  <li key={entry.name} className="flex items-start gap-2">
                    <span
                      className="mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          index === 0 ? ORG_SERIES.total : ORG_SERIES.active,
                      }}
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-700">
                        {entry.name}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {entry.value}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          (
                          {collaboratorTotal > 0
                            ? ((entry.value / collaboratorTotal) * 100).toFixed(
                                1,
                              )
                            : 0}
                          %)
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ChartContainer>
        </div>
      )}

      {/* ── Tab 3: Distribution ── */}
      {activeTab === "distribution" && (
        <div className="grid grid-cols-2 gap-4">
          <ChartContainer
            title="5. Rating Distribution (Bar Chart)"
            description="Organizations by average star rating"
            exportData={{
              filename: "rating-distribution",
              columns: EXPORT_COLUMNS.byRating,
              rows: data.byRating,
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={data.byRating}
                margin={{ top: 20, right: 12, bottom: 4, left: -12 }}
                barCategoryGap="26%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="rating"
                  tick={<RatingTick />}
                  stroke="#9ca3af"
                  interval={0}
                />
                <YAxis tick={axisTick} stroke="#9ca3af" />
                <Tooltip
                  cursor={{ fill: "rgba(74,58,167,0.06)" }}
                  content={<ChartTooltip />}
                />
                <Bar
                  dataKey="organizations"
                  name="Organizations"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={56}
                >
                  {data.byRating.map((row, index) => (
                    <Cell key={row.rating} fill={RATING_RAMP[index]} />
                  ))}
                  <LabelList
                    dataKey="organizations"
                    position="top"
                    style={{ fontSize: 12, fill: "#374151", fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="6. Profit vs Non-Profit (Stacked Bar Chart)"
            description="Organization mix over time"
            exportData={{
              filename: "profit-vs-non-profit",
              legend: PROFIT_LEGEND,
              columns: EXPORT_COLUMNS.profitTrend,
              rows: data.profitTrend,
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={data.profitTrend}
                margin={{ top: 20, right: 12, bottom: 4, left: -12 }}
                barCategoryGap="24%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={axisTick} stroke="#9ca3af" />
                <YAxis tick={axisTick} stroke="#9ca3af" />
                <Tooltip
                  cursor={{ fill: "rgba(59,130,246,0.06)" }}
                  content={<ChartTooltip />}
                />
                <Legend content={<ChartLegend items={PROFIT_LEGEND} />} />
                <Bar
                  dataKey="profit"
                  name="Profit Organizations"
                  stackId="orgs"
                  fill={ORG_SERIES.total}
                  stroke={SURFACE}
                  strokeWidth={2}
                />
                <Bar
                  dataKey="nonProfit"
                  name="Non-Profit Organizations"
                  stackId="orgs"
                  fill={ORG_SERIES.active}
                  stroke={SURFACE}
                  strokeWidth={2}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="flex flex-wrap justify-between gap-2 mt-3 pt-2 border-t border-gray-200 text-[11px] text-gray-400">
        <span>Data as of {data.asOf}</span>
        <span>All values are indicative and for dashboard purposes only.</span>
        <span>Source: Organization Database</span>
      </div>
    </div>
  );
};

export default OrganizationAnalytics;
