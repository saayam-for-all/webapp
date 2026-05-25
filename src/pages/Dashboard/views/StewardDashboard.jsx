import { useState } from "react";
import Table from "../../../common/components/DataTable/Table";

const StewardDashboard = (props) => {
  const [activeTab, setActiveTab] = useState("myRequests");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    headers,
    filteredData = [],
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
  } = props;

  const STATUS = {
    ALL: "all",
    CREATED: "CREATED",
    MATCHING_VOLUNTEER: "MATCHING VOLUNTEER",
    MANAGED: "MANAGED",
    RESOLVED: "RESOLVED",
    CANCELLED: "CANCELLED",
  };

  const normalizeStatus = (status) =>
    status?.toString().trim().toUpperCase().replaceAll("_", " ");

  const displayedRequests =
    statusFilter === STATUS.ALL
      ? filteredData
      : filteredData.filter(
          (request) =>
            normalizeStatus(request.status) === normalizeStatus(statusFilter),
        );

  const createdCount = filteredData.filter(
    (r) => normalizeStatus(r.status) === STATUS.CREATED,
  ).length;

  const matchingVolunteerCount = filteredData.filter(
    (r) => normalizeStatus(r.status) === STATUS.MATCHING_VOLUNTEER,
  ).length;

  const managedCount = filteredData.filter(
    (r) => normalizeStatus(r.status) === STATUS.MANAGED,
  ).length;

  const resolvedCount = filteredData.filter(
    (r) => normalizeStatus(r.status) === STATUS.RESOLVED,
  ).length;

  const cancelledCount = filteredData.filter(
    (r) => normalizeStatus(r.status) === STATUS.CANCELLED,
  ).length;

  return (
    <div>
      <div className="flex mb-5">
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
            activeTab === "myRequests"
              ? "bg-white text-blue-500 border-blue-500"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("myRequests")}
        >
          My Requests
        </button>

        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
            activeTab === "othersRequests"
              ? "bg-white text-blue-500 border-blue-500"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("othersRequests")}
        >
          Others&apos; Requests
        </button>
      </div>

      {activeTab === "myRequests" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5">
            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-500 font-semibold">Created</p>
              <p className="text-2xl font-bold">{createdCount}</p>
            </div>

            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-500 font-semibold">Matching Volunteer</p>
              <p className="text-2xl font-bold">{matchingVolunteerCount}</p>
            </div>

            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-500 font-semibold">Managed</p>
              <p className="text-2xl font-bold">{managedCount}</p>
            </div>

            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-500 font-semibold">Resolved</p>
              <p className="text-2xl font-bold">{resolvedCount}</p>
            </div>

            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-500 font-semibold">Cancelled</p>
              <p className="text-2xl font-bold">{cancelledCount}</p>
            </div>
          </div>

          {searchFilters}

          <div className="mb-4">
            <label className="mr-2 font-semibold">Filter by status:</label>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-3 py-2"
            >
              <option value="all">All</option>
              <option value="CREATED">CREATED</option>
              <option value="MATCHING VOLUNTEER">MATCHING VOLUNTEER</option>
              <option value="MANAGED">MANAGED</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="requests-section overflow-hidden table-height-fix">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : displayedRequests.length > 0 ? (
              <Table
                headers={headers}
                rows={displayedRequests}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages(displayedRequests)}
                totalRows={displayedRequests.length}
                itemsPerPage={rowsPerPage}
                sortConfig={sortConfig}
                requestSort={requestSort}
                onRowsPerPageChange={onRowsPerPageChange}
                getLinkPath={getLinkPath}
                getLinkState={getLinkState}
              />
            ) : (
              <div className="p-8 text-center text-gray-500 bg-white rounded">
                No requests found for this filter.
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "othersRequests" && (
        <div className="p-8 text-center text-gray-500 bg-white rounded">
          You do not have permission to view other stewards&apos; requests.
        </div>
      )}
    </div>
  );
};

export default StewardDashboard;
