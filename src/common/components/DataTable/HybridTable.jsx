import React, { useState, useEffect } from "react";
import Table from "./Table";
import ScrollableTable from "./ScrollableTable";

const HybridTable = ({
  headers,
  rows,
  currentPage,
  setCurrentPage,
  totalPages,
  totalRows,
  itemsPerPage,
  sortConfig,
  requestSort,
  onRowsPerPageChange,
  getLinkPath,
  getLinkState = undefined,
  defaultView = "scrollable", // "scrollable" or "paginated"
  maxHeight = "600px",
}) => {
  const [viewMode, setViewMode] = useState(defaultView);

  // Reset to page 1 when switching modes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode, setCurrentPage]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="space-y-4">
      {/* View mode toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">View Mode:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange("scrollable")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === "scrollable"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Scrollable
            </button>
            <button
              onClick={() => handleViewModeChange("paginated")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === "paginated"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Paginated
            </button>
          </div>
        </div>

        {/* Row count info */}
        <div className="text-sm text-gray-600">
          {viewMode === "scrollable"
            ? `${totalRows} total entries`
            : `Page ${currentPage} of ${totalPages}`}
        </div>
      </div>

      {/* Render appropriate table component */}
      {viewMode === "scrollable" ? (
        <ScrollableTable
          headers={headers}
          rows={rows}
          sortConfig={sortConfig}
          requestSort={requestSort}
          getLinkPath={getLinkPath}
          getLinkState={getLinkState}
          maxHeight={maxHeight}
          showRowCount={false} // We show it in the toggle area
        />
      ) : (
        <Table
          headers={headers}
          rows={rows}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          itemsPerPage={itemsPerPage}
          sortConfig={sortConfig}
          requestSort={requestSort}
          onRowsPerPageChange={onRowsPerPageChange}
          getLinkPath={getLinkPath}
          getLinkState={getLinkState}
        />
      )}
    </div>
  );
};

export default HybridTable;
