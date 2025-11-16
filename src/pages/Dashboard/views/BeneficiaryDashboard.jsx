import Table from "../../../common/components/DataTable/Table";

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
  } = props;

  return (
    <div>
      <div className="flex mb-5">
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold mr-1 ${
            activeTab === "myRequests"
              ? "bg-white border-gray-300"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("myRequests")}
        >
          {"My Requests"}
        </button>
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold mr-1 ${
            activeTab === "othersRequests"
              ? "bg-white border-gray-300"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("othersRequests")}
        >
          {"Others Requests"}
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

export default BeneficiaryDashboard;
