import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

/**
 * ScrollableTable - A table component with infinite scroll functionality
 *
 * @param {Object} props - Component props
 * @param {string[]} props.headers - Array of column headers
 * @param {Object[]} props.rows - Array of data objects to display
 * @param {Object} props.sortConfig - Current sort configuration {key, direction}
 * @param {Function} props.requestSort - Function to handle column sorting
 * @param {Function} props.getLinkPath - Function to generate link paths for rows
 * @param {Function} [props.getLinkState] - Optional function to generate link state
 * @param {Function} props.onLoadMore - Function called when more data should be loaded
 * @param {boolean} props.hasMore - Whether more data is available to load
 * @param {boolean} props.isLoading - Whether initial data is loading
 * @param {number} props.totalRows - Total number of rows available
 * @returns {JSX.Element} ScrollableTable component
 */
const ScrollableTable = ({
  headers,
  rows,
  sortConfig,
  requestSort,
  getLinkPath,
  getLinkState = undefined,
  onLoadMore,
  hasMore,
  isLoading,
  totalRows,
}) => {
  const tableRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /**
   * Get sort indicator for column headers
   * @param {string} key - Column key
   * @returns {string} Sort indicator (↑, ↓, or empty)
   */
  const getSortIndicator = (key) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  /**
   * Handle scroll event to trigger loading more data
   * Uses intersection observer pattern with threshold-based triggering
   */
  const handleScroll = useCallback(() => {
    if (!tableRef.current || isLoadingMore || !hasMore || !onLoadMore) return;

    const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
    const threshold = 100; // Load more when 100px from bottom

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      setIsLoadingMore(true);
      onLoadMore().finally(() => {
        setIsLoadingMore(false);
      });
    }
  }, [onLoadMore, hasMore, isLoadingMore]);

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener("scroll", handleScroll);
      return () => tableElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="relative h-full" data-testid="scrollable-container">
      <div
        ref={tableRef}
        className="overflow-auto h-full max-h-96"
        data-testid="scrollable-table-container"
      >
        <table
          className="min-w-full divide-y divide-gray-200"
          data-testid="scrollable-table"
        >
          <thead
            className="bg-gray-50 sticky top-0 z-10"
            data-testid="scrollable-table-header"
          >
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                  data-testid="scrollable-map-header-one"
                >
                  <button
                    type="button"
                    onClick={() => requestSort(key)}
                    className="hover:text-gray-900 focus:outline-none focus:text-gray-900"
                  >
                    {key.charAt(0).toUpperCase() +
                      key
                        .slice(1)
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    {getSortIndicator(key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className="bg-white divide-y divide-gray-200"
            data-testid="scrollable-table-body"
          >
            {rows.map((request, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    data-testid="scrollable-map-data-one"
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

        {/* Loading indicator */}
        {(isLoading || isLoadingMore) && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">
              {isLoadingMore ? "Loading more..." : "Loading..."}
            </span>
          </div>
        )}

        {/* End of data indicator */}
        {!hasMore && rows.length > 0 && (
          <div className="flex justify-center items-center py-4 text-gray-500 text-sm">
            No more data to load
          </div>
        )}

        {/* Empty state */}
        {!isLoading && rows.length === 0 && (
          <div className="flex justify-center items-center py-8 text-gray-500">
            <div className="text-center">
              <div className="text-lg font-medium">No requests found</div>
              <div className="text-sm">
                Try adjusting your search or filters
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Row count indicator */}
      {rows.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 px-4 py-2 text-sm text-gray-600 border-t">
          Showing {rows.length} of {totalRows || rows.length} entries
        </div>
      )}
    </div>
  );
};

export default ScrollableTable;
