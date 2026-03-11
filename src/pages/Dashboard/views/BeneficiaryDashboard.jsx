import Table from "../../../common/components/DataTable/Table";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const BeneficiaryDashboard = (props) => {
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

  const { t } = useTranslation();

  return (
    <div>
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl mx-4 mt-4">
        <button
          className={`flex-1 py-3 px-4 text-center cursor-pointer rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === "myRequests"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          onClick={() => handleTabChange("myRequests")}
        >
          {t("MY_REQUESTS")}
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center cursor-pointer rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === "othersRequests"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          onClick={() => handleTabChange("othersRequests")}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {t("OTHERS_REQUESTS")}
            <div className="relative group cursor-pointer">
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-bold">
                ?
              </div>
              <div className="absolute left-5 top-0 w-[10rem] bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10 pointer-events-none shadow-lg">
                Requests filed for other people
              </div>
            </div>
          </span>
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

BeneficiaryDashboard.propTypes = {
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

export default BeneficiaryDashboard;
