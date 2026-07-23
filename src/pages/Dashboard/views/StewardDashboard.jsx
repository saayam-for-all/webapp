import { useEffect, useState } from "react";
import Table from "../../../common/components/DataTable/Table";
import LoadingIndicator from "../../../common/components/Loading/Loading";
import { getVolunteersData } from "../../../services/volunteerServices";

const StewardDashboard = (props) => {
  const [activeTab, setActiveTab] = useState("allRequests");
  const [volunteerData, setVolunteerData] = useState([]);
  const [isVolunteerLoading, setIsVolunteerLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "volunteers") {
      return;
    }

    const fetchVolunteers = async () => {
      setIsVolunteerLoading(true);

      try {
        const data = await getVolunteersData();
        setVolunteerData(data || []);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
        setVolunteerData([]);
      } finally {
        setIsVolunteerLoading(false);
      }
    };

    fetchVolunteers();
  }, [activeTab]);

  const volunteerHeaders = ["User Id", "Updated Time", "Volunteering Request"];

  const getVolunteerLinkPath = (volunteer, header) => {
    if (header === "User Id") {
      return "/profile";
    }

    if (header === "Volunteering Request") {
      return "/promote-to-volunteer?step=5";
    }

    return null;
  };

  const volunteerRows = volunteerData.map((volunteer) => ({
    ...volunteer,
    "User Id": volunteer.userId,
    "Updated Time": volunteer.updatedAt
      ? new Date(volunteer.updatedAt).toLocaleString()
      : "",
    "Volunteering Request": "Review",
    volunteerRequestId: volunteer.volunteerRequestId,
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
      <div className="mb-5 flex">
        <button
          type="button"
          className={`flex-1 cursor-pointer border-b-2 py-3 text-center font-bold ${
            activeTab === "allRequests"
              ? "border-blue-500 bg-white text-blue-500"
              : "border-transparent bg-gray-300 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("allRequests")}
        >
          All Requests
        </button>

        <button
          type="button"
          className={`flex-1 cursor-pointer border-b-2 py-3 text-center font-bold ${
            activeTab === "volunteers"
              ? "border-blue-500 bg-white text-blue-500"
              : "border-transparent bg-gray-300 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("volunteers")}
        >
          Volunteers
        </button>
      </div>

      {activeTab === "allRequests" && (
        <>
          {searchFilters}

          <div className="requests-section table-height-fix overflow-hidden">
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
        <div className="requests-section table-height-fix overflow-hidden">
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
              getLinkState={(volunteer) => ({
                ...volunteer,
                isStewardReview: true,
              })}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StewardDashboard;
