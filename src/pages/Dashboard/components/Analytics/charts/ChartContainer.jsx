import { useState } from "react";
import PropTypes from "prop-types";

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

/**
 * ChartContainer - Reusable wrapper for all analytics charts
 *
 * Normal view: chart renders inline in the grid (compact size)
 * Maximize:    same chart opens in a full-screen modal (larger size)
 */
const ChartContainer = ({ title, description, children, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          <button
            onClick={() => setIsExpanded(true)}
            title="Expand chart"
            aria-label="Expand chart"
            className="flex-shrink-0 p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ExpandIcon />
          </button>
        </div>

        {/* Chart content — always visible */}
        <div className="p-4 w-full flex-1">{children}</div>
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

            {/* Chart content — same children, but wider/taller container */}
            <div className="overflow-y-auto flex-1 p-6 w-full">{children}</div>
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
};

export default ChartContainer;
