import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const ScrollableTable = ({
  headers,
  rows,
  sortConfig,
  requestSort,
  getLinkPath,
  getLinkState = undefined,
  maxHeight = "600px", // Default max height for scrollable area
  showRowCount = true, // Show total row count
  className = "", // Additional CSS classes
}) => {
  const navigate = useNavigate();

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  return (
    <div
      className={`relative ${className}`}
      data-testid="scrollable-table-container"
    >
      {/* Row count display */}
      {showRowCount && (
        <div className="px-6 py-2 text-sm text-gray-600 border-b border-gray-200">
          Showing {rows.length} {rows.length === 1 ? "entry" : "entries"}
        </div>
      )}

      {/* Scrollable table container */}
      <div
        className="overflow-auto border border-gray-200 rounded-lg"
        style={{ maxHeight }}
        data-testid="scrollable-table-wrapper"
      >
        <table
          className="min-w-full divide-y divide-gray-200"
          data-testid="scrollable-table"
        >
          {/* Fixed header */}
          <thead
            className="bg-gray-50 sticky top-0 z-10"
            data-testid="scrollable-table-header"
          >
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50"
                  data-testid="scrollable-header-one"
                >
                  <button
                    type="button"
                    onClick={() => requestSort(key)}
                    className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                  >
                    <span>
                      {key.charAt(0).toUpperCase() +
                        key
                          .slice(1)
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                    </span>
                    <span className="text-gray-400">
                      {getSortIndicator(key)}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          {/* Scrollable body */}
          <tbody
            className="bg-white divide-y divide-gray-200"
            data-testid="scrollable-table-body"
          >
            {rows.map((request, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    data-testid="scrollable-data-one"
                  >
                    {header === "id" ? (
                      <Link
                        to={getLinkPath(request, header)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        state={getLinkState ? getLinkState(request) : {}}
                      >
                        {request[header]}
                      </Link>
                    ) : (
                      <span className="text-gray-900">{request[header]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {rows.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium mb-2">No data available</div>
          <div className="text-sm">
            There are no entries to display at this time.
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollableTable;
