import Table from "../../../common/components/DataTable/Table";

const StewardDashboard = (props) => {
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
  } = props;

  return (
    <div>
      <div className="flex mb-5">
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold bg-white text-blue-500 border-blue-500`}
        >
          All Requests
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

export default StewardDashboard;
