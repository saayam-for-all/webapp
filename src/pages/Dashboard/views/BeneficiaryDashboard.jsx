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
      <div className="flex mb-5">
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
            activeTab === "myRequests"
              ? "bg-white text-blue-500 border-blue-500"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("myRequests")}
        >
          {t("MY_REQUESTS")}
        </button>
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
            activeTab === "othersRequests"
              ? "bg-white text-blue-500 border-blue-500"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("othersRequests")}
        >
          {t("OTHERS_REQUESTS")}
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
