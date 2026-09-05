import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { downloadCsv, downloadPng } from "./chartExport";

const ExpandIcon = () => (
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
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
    />
  </svg>
);

const CollapseIcon = () => (
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
      d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <circle cx="12" cy="5" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="12" cy="19" r="1.75" />
  </svg>
);

/**
 * Kebab menu offering the chart's data as a table, a CSV, or a PNG.
 * Only rendered when a chart supplies `exportData`.
 */
const ChartMenu = ({ showTable, onToggleTable, onExportCsv, onExportPng }) => {
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!wrapper.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const run = (action) => () => {
    setOpen(false);
    action();
  };

  const itemClass =
    "w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700";

  return (
    <div className="relative" ref={wrapper}>
      <button
        onClick={() => setOpen((s) => !s)}
        title="Chart options"
        aria-label="Chart options"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex-shrink-0 p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <MenuIcon />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
        >
          <button
            role="menuitem"
            className={itemClass}
            onClick={run(onToggleTable)}
          >
            {showTable ? "View as chart" : "View as table"}
          </button>
          <button
            role="menuitem"
            className={itemClass}
            onClick={run(onExportCsv)}
          >
            Export CSV
          </button>
          <button
            role="menuitem"
            className={itemClass}
            onClick={run(onExportPng)}
          >
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
};

ChartMenu.propTypes = {
  showTable: PropTypes.bool,
  onToggleTable: PropTypes.func.isRequired,
  onExportCsv: PropTypes.func.isRequired,
  onExportPng: PropTypes.func.isRequired,
};

/** Accessible fallback view of the same numbers the chart plots. */
const DataTable = ({ columns, rows }) => (
  <div className="overflow-auto max-h-[280px]">
    <table className="min-w-full text-xs text-left">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((row, index) => (
          <tr key={index} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td
                key={col.key}
                className="px-3 py-1.5 text-gray-700 whitespace-nowrap"
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
};

/**
 * ChartContainer - Reusable wrapper for all analytics charts
 *
 * Normal view: chart renders inline in the grid (compact size)
 * Maximize:    same chart opens in a full-screen modal (larger size)
 */
const ChartContainer = ({
  title,
  description,
  children,
  className = "",
  exportData = null,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [exportError, setExportError] = useState(null);
  const bodyRef = useRef(null);

  const handleExportCsv = () =>
    downloadCsv(exportData.filename, exportData.columns, exportData.rows);

  const handleExportPng = () => {
    const svg = bodyRef.current?.querySelector("svg.recharts-surface");
    if (!svg) {
      // Nothing to rasterise — the card is showing its table view.
      setExportError("Switch back to the chart view to download a PNG.");
      return;
    }
    setExportError(null);
    downloadPng(svg, exportData.filename, { legend: exportData.legend }).catch(
      () => setExportError("Could not download this chart."),
    );
  };

  const menu = exportData ? (
    <ChartMenu
      showTable={showTable}
      onToggleTable={() => setShowTable((s) => !s)}
      onExportCsv={handleExportCsv}
      onExportPng={handleExportPng}
    />
  ) : null;

  const body =
    exportData && showTable ? (
      <DataTable columns={exportData.columns} rows={exportData.rows} />
    ) : (
      children
    );

  return (
    <>
      {/* ── Normal inline card (always shows chart) ── */}
      <div
        className={`bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col ${className}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex-1 min-w-0 pr-2">
            {title && (
              <h3 className="text-base font-semibold text-gray-800">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
          <div className="flex items-start flex-shrink-0">
            <button
              onClick={() => setIsExpanded(true)}
              title="Expand chart"
              aria-label="Expand chart"
              className="flex-shrink-0 p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ExpandIcon />
            </button>
            {menu}
          </div>
        </div>

        {/* Chart content — always visible */}
        <div className="p-4 w-full flex-1" ref={bodyRef}>
          {body}
          {exportError && (
            <p className="mt-2 text-xs text-amber-600 text-left">
              {exportError}
            </p>
          )}
        </div>
      </div>

      {/* ── Full-screen modal (maximize) ── */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsExpanded(false);
          }}
        >
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                {title && (
                  <h3 className="text-xl font-semibold text-gray-800">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                )}
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                title="Close"
                aria-label="Close expanded chart"
                className="ml-4 flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <CollapseIcon />
              </button>
            </div>

            {/* Chart content — same body, but wider/taller container */}
            <div className="overflow-y-auto flex-1 p-6 w-full">{body}</div>
          </div>
        </div>
      )}
    </>
  );
};

ChartContainer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  // Opt-in: supplying this adds the kebab menu (table view / CSV / PNG).
  exportData: PropTypes.shape({
    filename: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ).isRequired,
    rows: PropTypes.array.isRequired,
    // Multi-series charts whose legend is rendered outside the SVG pass it
    // here so the exported PNG keeps its series labels.
    legend: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        type: PropTypes.string,
        color: PropTypes.string,
      }),
    ),
  }),
};

export default ChartContainer;
