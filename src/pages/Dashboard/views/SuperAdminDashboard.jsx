import Table from "../../../common/components/DataTable/Table";
import PropTypes from "prop-types";
import ApplicationAnalytics from "../components/Analytics/ApplicationAnalytics";
import GoogleAnalytics from "../components/Analytics/GoogleAnalytics";

const SuperAdminDashboard = (props) => {
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
      <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-xl mx-4 mt-4">
        <button
          className={`flex-1 py-3 px-4 text-center cursor-pointer rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === "analytics"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          onClick={() => handleTabChange("analytics")}
        >
          Analytics
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center cursor-pointer rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === "myRequests"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          onClick={() => handleTabChange("myRequests")}
        >
          All Requests
        </button>
      </div>

      {searchFilters}

      <div className="requests-section overflow-hidden table-height-fix">
        {activeTab === "analytics" && (
          <div className="flex gap-1 p-1 bg-gray-50 rounded-lg mx-4 mb-4">
            <button
              className={`flex-1 py-2 px-3 text-center cursor-pointer rounded-md font-medium text-sm transition-all duration-200 ${
                analyticsSubtab === "Infrastructure"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
              onClick={() => setAnalyticsSubtab("Infrastructure")}
            >
              Infrastructure
            </button>
            <button
              className={`flex-1 py-2 px-3 text-center cursor-pointer rounded-md font-medium text-sm transition-all duration-200 ${
                analyticsSubtab === "Application Analytics"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
              onClick={() => setAnalyticsSubtab("Application Analytics")}
            >
              Application Analytics
            </button>
            <button
              className={`flex-1 py-2 px-3 text-center cursor-pointer rounded-md font-medium text-sm transition-all duration-200 ${
                analyticsSubtab === "Google Analytics"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
              onClick={() => setAnalyticsSubtab("Google Analytics")}
            >
              Google Analytics
            </button>
          </div>
        )}

        {activeTab === "analytics" ? (
          <div className="text-center text-gray-600">
            {analyticsSubtab === "Infrastructure" && (
              <div className="py-8">
                <p className="text-gray-700">
                  To view infrastructure related analytics from AWS CloudWatch,{" "}
                  <a
                    href="https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards/dashboard/Saayam-Dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    click here
                  </a>
                  .
                </p>
              </div>
            )}
            {analyticsSubtab === "Application Analytics" && (
              <ApplicationAnalytics />
            )}
            {analyticsSubtab === "Google Analytics" && <GoogleAnalytics />}
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

SuperAdminDashboard.propTypes = {
  activeTab: PropTypes.string,
  handleTabChange: PropTypes.func,
  headers: PropTypes.array,
  filteredData: PropTypes.array,
  isLoading: PropTypes.bool,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  totalPages: PropTypes.func,
  rowsPerPage: PropTypes.number,
  sortConfig: PropTypes.object,
  requestSort: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  getLinkPath: PropTypes.func,
  getLinkState: PropTypes.object,
  searchFilters: PropTypes.node,
  analyticsSubtab: PropTypes.string,
  setAnalyticsSubtab: PropTypes.func,
};

export default SuperAdminDashboard;
