import { useState, useEffect } from "react";
import Table from "../../../common/components/DataTable/Table";
import LoadingIndicator from "../../../common/components/Loading/Loading";
import { getMockVolunteersData } from "../../../services/volunteerServices";

const StewardDashboard = (props) => {
  const [activeTab, setActiveTab] = useState("allRequests");
  const [volunteerData, setVolunteerData] = useState([]);
  const [isVolunteerLoading, setIsVolunteerLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "volunteers") {
      const fetchVolunteers = async () => {
        setIsVolunteerLoading(true);
        try {
          const data = await getMockVolunteersData();
          setVolunteerData(data);
        } catch (error) {
          console.error("Error fetching volunteers:", error);
        } finally {
          setIsVolunteerLoading(false);
        }
      };
      fetchVolunteers();
    }
  }, [activeTab]);

  const volunteerHeaders = ["User Id", "Updated Time", "Volunteering Request"];

  const getVolunteerLinkPath = (volunteer, header) => {
    if (header === "User Id") {
      return `/profile`;
    }
    if (header === "Volunteering Request") {
      return `/promote-to-volunteer?step=5`;
    }
    return null;
  };

  const volunteerRows = volunteerData.map((v) => ({
    "User Id": v.userId,
    "Updated Time": v.updatedAt ? new Date(v.updatedAt).toLocaleString() : "",
    "Volunteering Request": "Review",
    volunteerRequestId: v.volunteerRequestId,
  }));

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
          Review Requests
        </button>
        <button
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
            activeTab === "volunteers"
              ? "bg-white text-blue-500 border-blue-500"
              : "bg-gray-300 border-transparent hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("volunteers")}
        >
          Review Volunteers
        </button>
      </div>

      {activeTab === "allRequests" && (
        <>
          {searchFilters}

          <div className="requests-section overflow-hidden table-height-fix">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <LoadingIndicator size="50px" position="beside" />
              </div>
            ) : (
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
        <div className="requests-section overflow-hidden table-height-fix">
          {isVolunteerLoading ? (
            <div className="flex justify-center py-10">
              <LoadingIndicator size="50px" position="beside" />
            </div>
          ) : (
            <Table
              headers={volunteerHeaders}
              rows={volunteerRows}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={Math.ceil(volunteerRows.length / rowsPerPage)}
              totalRows={volunteerRows.length}
              itemsPerPage={rowsPerPage}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onRowsPerPageChange={onRowsPerPageChange}
              getLinkPath={getVolunteerLinkPath}
              getLinkState={(volunteer) => volunteer}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StewardDashboard;
