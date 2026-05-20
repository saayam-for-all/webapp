import { useState } from "react";
import Table from "../../../common/components/DataTable/Table";

const StewardDashboard = (props) => {
  const [activeTab, setActiveTab] = useState("allRequests");

  const {
    headers,
    filteredData,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    rowsPerPage,
    sortConfig,
    requestSort,
    onRowsPerPageChange,
    getLinkPath,
    getLinkState,
    searchFilters,
    serverPaginated,
    serverTotalRows,
  } = props;

  return (
    <div>
      <div className="flex mb-5">
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
            activeTab === "allRequests"
              ? "bg-white text-blue-500 border-blue-500"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("allRequests")}
        >
          All Requests
        </button>
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
            activeTab === "volunteers"
              ? "bg-white text-blue-500 border-blue-500"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("volunteers")}
        >
          Volunteers
        </button>
      </div>

      {activeTab === "allRequests" && (
        <>
          {searchFilters}

          <div className="requests-section overflow-hidden table-height-fix">
            {!isLoading && (
              <Table
                headers={headers}
                rows={filteredData}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages(filteredData)}
                totalRows={
                  serverPaginated ? serverTotalRows : filteredData.length
                }
                itemsPerPage={rowsPerPage}
                sortConfig={sortConfig}
                requestSort={requestSort}
                onRowsPerPageChange={onRowsPerPageChange}
                getLinkPath={getLinkPath}
                getLinkState={getLinkState}
                serverPaginated={serverPaginated}
              />
            )}
          </div>
        </>
      )}

      {activeTab === "volunteers" && (
        <div className="requests-section overflow-hidden table-height-fix" />
      )}
    </div>
  );
};

export default StewardDashboard;
