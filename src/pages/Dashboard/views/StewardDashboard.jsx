import { useEffect, useState } from "react";

import Table from "../../../common/components/DataTable/Table";
import LoadingIndicator from "../../../common/components/Loading/Loading";
import { getMockVolunteersData } from "../../../services/volunteerServices";

const StewardDashboard = (props) => {
  const [activeTab, setActiveTab] = useState("allRequests");
  const [volunteerData, setVolunteerData] = useState([]);
  const [isVolunteerLoading, setIsVolunteerLoading] = useState(false);

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

  useEffect(() => {
    if (activeTab !== "volunteers") {
      return;
    }

    const fetchVolunteers = async () => {
      setIsVolunteerLoading(true);

      try {
        // Keep the mock API for Issue #1656.
        const data = await getMockVolunteersData();

        setVolunteerData(Array.isArray(data) ? data : []);
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

    // This comes from the mock volunteer service.
    phoneNumber:
      volunteer.phoneNumber || volunteer.phone || volunteer.mobileNumber || "",
  }));

  const getVolunteerLinkState = (volunteer) => ({
    userId: volunteer.userId,
    updatedAt: volunteer.updatedAt,
    volunteerRequestId: volunteer.volunteerRequestId,
    phoneNumber: volunteer.phoneNumber,
    isStewardReview: true,
  });

  const volunteerTotalPages = Math.max(
    1,
    Math.ceil(volunteerRows.length / rowsPerPage),
  );

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
              totalPages={volunteerTotalPages}
              totalRows={volunteerRows.length}
              itemsPerPage={rowsPerPage}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onRowsPerPageChange={onRowsPerPageChange}
              getLinkPath={getVolunteerLinkPath}
              getLinkState={getVolunteerLinkState}
              serverPaginated={false}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StewardDashboard;
