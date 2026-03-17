import { useEffect } from "react";
import PropTypes from "prop-types";
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
    searchFilters,
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
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold bg-white text-blue-500 border-blue-500`}
        >
          Managed Requests
        </button>
      </div>

      {searchFilters}

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

VolunteerDashboard.propTypes = {
  activeTab: PropTypes.string.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  filteredData: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  totalPages: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  sortConfig: PropTypes.object,
  requestSort: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  getLinkPath: PropTypes.func.isRequired,
  getLinkState: PropTypes.func.isRequired,
  searchFilters: PropTypes.node,
};

export default VolunteerDashboard;
