import { useEffect } from "react";
import Table from "../../../common/components/DataTable/Table";

const VolunteerDashboard = (props) => {
  const {
    activeTab,
    handleTabChange,
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
  } = props;

  // ensure managedRequests tab is selected for volunteer
  useEffect(() => {
    if (activeTab !== "managedRequests") handleTabChange("managedRequests");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex mb-5">
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold bg-white border-gray-300 mr-1`}
        >
          Managed Requests
        </button>
      </div>

      <div className="requests-section overflow-hidden table-height-fix">
        {!isLoading && (
          <Table
            headers={headers}
            rows={filteredData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages(filteredData)}
            totalRows={filteredData.length}
            itemsPerPage={rowsPerPage}
            sortConfig={sortConfig}
            requestSort={requestSort}
            onRowsPerPageChange={onRowsPerPageChange}
            getLinkPath={getLinkPath}
            getLinkState={getLinkState}
          />
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
