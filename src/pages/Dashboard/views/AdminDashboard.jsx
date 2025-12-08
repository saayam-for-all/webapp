import Table from "../../../common/components/DataTable/Table";
import PropTypes from "prop-types";

const AdminDashboard = (props) => {
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
    analyticsSubtab,
    setAnalyticsSubtab,
  } = props;

  return (
    <div>
      <div className="flex mb-5">
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
            activeTab === "analytics"
              ? "bg-white text-blue-500 border-blue-500"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("analytics")}
        >
          Analytics
        </button>
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
            activeTab === "myRequests"
              ? "bg-white text-blue-500 border-blue-500"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("myRequests")}
        >
          All Requests
        </button>
      </div>

      {searchFilters}

      <div className="requests-section overflow-hidden table-height-fix">
        {activeTab === "analytics" && (
          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 text-center cursor-pointer border-b-2 font-semibold 
              ${
                analyticsSubtab === "Infrastructure"
                  ? "bg-white text-blue-500 border-blue-500"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              } mr-1`}
              onClick={() => setAnalyticsSubtab("Infrastructure")}
            >
              Infrastructure
            </button>
            <button
              className={`flex-1 py-2 text-center cursor-pointer border-b-2 font-semibold 
              ${
                analyticsSubtab === "Application Analytics"
                  ? "bg-white text-blue-500 border-blue-500"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              } mr-1`}
              onClick={() => setAnalyticsSubtab("Application Analytics")}
            >
              Application Analytics
            </button>
            <button
              className={`flex-1 py-2 text-center cursor-pointer border-b-2 font-semibold 
              ${
                analyticsSubtab === "Google Analytics"
                  ? "bg-white text-blue-500 border-blue-500"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              }`}
              onClick={() => setAnalyticsSubtab("Google Analytics")}
            >
              Google Analytics
            </button>
          </div>
        )}

        {activeTab === "analytics" ? (
          <div className="p-6 text-center text-gray-600">
            {analyticsSubtab === "Infrastructure" && (
              <>Infrastructure (Summary of Errors) - To Be Implemented</>
            )}
            {analyticsSubtab === "Application Analytics" && (
              <>Application Analytics - To Be Implemented</>
            )}
            {analyticsSubtab === "Google Analytics" && (
              <>Google Analytics - To Be Implemented</>
            )}
          </div>
        ) : (
          !isLoading && (
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
          )
        )}
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {
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
  analyticsSubtab: PropTypes.string.isRequired,
  setAnalyticsSubtab: PropTypes.func.isRequired,
};
export default AdminDashboard;
