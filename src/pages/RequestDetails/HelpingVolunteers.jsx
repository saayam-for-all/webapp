import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getVolunteersData } from "../../services/volunteerServices";
import {
  createZoomMeeting,
  storeMeetingDetails,
} from "../../services/meetingServices";
import { FaVideo } from "react-icons/fa";

const HelpingVolunteers = () => {
  const { t } = useTranslation();
  // Modal state for Zoom meeting scheduling
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetingError, setMeetingError] = useState("");
  const [meetingSuccess, setMeetingSuccess] = useState("");

  // Auto-hide meeting success message after 2 seconds
  useEffect(() => {
    if (meetingSuccess) {
      const timer = setTimeout(() => setMeetingSuccess(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [meetingSuccess]);
  const [isOpen, setIsOpen] = useState(false);
  const [chooseVolunteer, setChooseVolunteer] = useState(true);
  const [volunteersCount, setVolunteersCount] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(""); // State for filter functionality
  const [sortBy, setSortBy] = useState("Newest"); // State for sort functionality

  // Get the current system date
  const systemDate = new Date();
  const volunteersAssigned = 5;
  const formattedDate = systemDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // api integrated code

  const [volunteerData, setVolunteerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        const list = await getVolunteersData();
        setVolunteerData(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err?.message || "Failed to fetch volunteers");
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, []);

  // Dummy volunteer data with added date field
  // const volunteerData = useMemo(
  //   () => [
  //     {
  //       name: "Jane Cooper",
  //       cause: "Cooking",
  //       phone: "(225) 555-0118",
  //       email: "jane@microsoft.com",
  //       location: "Boston, USA",
  //       rating: "★★★★★",
  //       dateAdded: "2023-10-01",
  //     },
  //     {
  //       name: "Floyd Miles",
  //       cause: "Banking",
  //       phone: "(205) 555-0100",
  //       email: "floyd@yahoo.com",
  //       location: "New York, USA",
  //       rating: "★★★☆☆",
  //       dateAdded: "2023-09-25",
  //     },
  //     {
  //       name: "Ronald Richards",
  //       cause: "Medical",
  //       phone: "(302) 555-0107",
  //       email: "ronald@adobe.com",
  //       location: "Brasilia, Brazil",
  //       rating: "★★★★☆",
  //       dateAdded: "2023-10-05",
  //     },
  //     {
  //       name: "Marvin McKinney",
  //       cause: "College admission",
  //       phone: "(252) 555-0126",
  //       email: "marvin@tesla.com",
  //       location: "Delhi, India",
  //       rating: "★★★★★",
  //       dateAdded: "2023-09-30",
  //     },
  //     {
  //       name: "Jerome Bell",
  //       cause: "Housing",
  //       phone: "(629) 555-0129",
  //       email: "jerome@google.com",
  //       location: "Texas, USA",
  //       rating: "★★★☆☆",
  //       dateAdded: "2023-10-10",
  //     },
  //     {
  //       name: "Kathryn Murphy",
  //       cause: "Cooking",
  //       phone: "(406) 555-0120",
  //       email: "kathryn@microsoft.com",
  //       location: "Chicago, USA",
  //       rating: "★★☆☆☆",
  //       dateAdded: "2023-10-08",
  //     },
  //   ],
  //   [],
  // );

  // Columns for the table
  const headers = [
    { key: "select", label: "Select" },
    { key: "name", label: "Name" },
    { key: "cause", label: "Cause" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "rating", label: "Rating" },
  ];

  // State for selected volunteers
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);

  // Handle checkbox change
  const handleCheckboxChange = (email) => {
    setSelectedVolunteers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  // Sorting function based on dropdown selection and column clicks
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sorting and filtering logic
  const filteredAndSortedVolunteers = useMemo(() => {
    let topN = volunteerData.slice(
      0,
      Math.min(volunteerData.length, volunteersCount),
    );
    let filteredVolunteers = topN.filter((volunteer) =>
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (filter) {
      filteredVolunteers = filteredVolunteers.filter((volunteer) =>
        volunteer.cause.toLowerCase().includes(filter.toLowerCase()),
      );
    }

    filteredVolunteers.sort((a, b) => {
      if (sortConfig.key === "dateAdded") {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }
    });

    return filteredVolunteers;
  }, [volunteerData, searchTerm, filter, sortConfig, volunteersCount]);

  const totalRows = filteredAndSortedVolunteers.length;
  const totalPages = Math.ceil(totalRows / itemsPerPage);

  // Pagination Logic
  const paginatedData = filteredAndSortedVolunteers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        className={`px-3 py-1 rounded ${
          i === currentPage
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-black"
        }`}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </button>,
    );
  }

  return (
    <div className="w-full border border-gray-300 rounded-md">
      {loading && (
        <div className="text-center py-8 text-lg font-semibold" role="status">
          Loading...
        </div>
      )}
      {error && (
        <div className="text-red-600 font-semibold px-4 pt-4" role="alert">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="font-bold text-lg">Volunteer Management</div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
          disabled={selectedVolunteers.length === 0}
          onClick={() => setMeetingModalOpen(true)}
        >
          <FaVideo className="text-lg" />
          <span>Zoom Meeting</span>
        </button>
        {meetingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                onClick={() => {
                  setMeetingModalOpen(false);
                  setMeetingDate("");
                  setMeetingTime("");
                  setMeetingError("");
                }}
                disabled={meetingLoading}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex items-center gap-3 mb-6">
                <FaVideo className="text-2xl text-blue-500" />
                <h2 className="text-2xl font-bold tracking-tight">
                  Schedule Zoom Meeting
                </h2>
              </div>
              <div className="mb-5">
                <label className="block mb-1 font-semibold text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  className="border-2 border-gray-200 rounded-lg px-4 py-2 w-full focus:border-blue-400 focus:outline-none transition"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  disabled={meetingLoading}
                />
                <label
                  htmlFor="meeting-date"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Date
                </label>
                <input
                  id="meeting-date"
                  type="date"
                  className="border-2 border-gray-200 rounded-lg px-4 py-2 w-full focus:border-blue-400 focus:outline-none transition"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  disabled={meetingLoading}
                />
              </div>
              <div className="mb-5">
                <label className="block mb-1 font-semibold text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  className="border-2 border-gray-200 rounded-lg px-4 py-2 w-full focus:border-blue-400 focus:outline-none transition"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  disabled={meetingLoading}
                />
                <label
                  htmlFor="meeting-time"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Time
                </label>
                <input
                  id="meeting-time"
                  type="time"
                  className="border-2 border-gray-200 rounded-lg px-4 py-2 w-full focus:border-blue-400 focus:outline-none transition"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  disabled={meetingLoading}
                />
              </div>
              {meetingError && (
                <div className="text-red-600 mb-3 font-medium animate-shake">
                  {meetingError}
                </div>
              )}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
                  onClick={() => {
                    setMeetingModalOpen(false);
                    setMeetingDate("");
                    setMeetingTime("");
                    setMeetingError("");
                  }}
                  disabled={meetingLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                  onClick={async () => {
                    if (!meetingDate || !meetingTime) {
                      setMeetingError("Please select both date and time.");
                      return;
                    }
                    setMeetingError("");
                    setMeetingLoading(true);
                    setMeetingSuccess("");
                    try {
                      // 1. Create Zoom meeting and send emails
                      const meetingRes = await createZoomMeeting({
                        emails: selectedVolunteers,
                        date: meetingDate,
                        time: meetingTime,
                      });
                      // 2. Store meeting details in DB
                      await storeMeetingDetails({
                        emails: selectedVolunteers,
                        date: meetingDate,
                        time: meetingTime,
                        zoomLink: meetingRes.zoomLink || "",
                        meetingId: meetingRes.meetingId || "",
                      });
                      setMeetingSuccess(
                        "Meeting scheduled and invitations sent!",
                      );
                      setMeetingModalOpen(false);
                      setMeetingDate("");
                      setMeetingTime("");
                      setSelectedVolunteers([]);
                    } catch (err) {
                      setMeetingError(
                        err?.message || "Failed to schedule meeting.",
                      );
                    } finally {
                      setMeetingLoading(false);
                    }
                  }}
                  disabled={meetingLoading}
                >
                  {meetingLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>{" "}
                      Scheduling...
                    </span>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {meetingSuccess && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl shadow-2xl z-50 text-lg font-semibold animate-fadeIn">
            <span className="mr-2">✅</span>
            {meetingSuccess}
          </div>
        )}
      </div>
      <div className="bg-gray-100 shadow-md p-1 space-y-4 rounded-b-md">
        <div className="flex items-center space-x-4 p-4 mt-2">
          <input
            type="text"
            placeholder={t("NUMBER_OF_VOLUNTEERS")}
            className="p-3 border rounded-md w-1/3"
            value={volunteersCount}
            onChange={(e) => {
              setVolunteersCount(e.target.value);
              setChooseVolunteer(false);
            }}
          />
          <button
            className="bg-blue-500 px-6 py-3 text-white rounded-lg whitespace-nowrap hover:bg-blue-600 flex items-center"
            onClick={() => setChooseVolunteer(true)}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("REQUEST_VOLUNTEERS")}
          </button>
        </div>

        <div className="mt-6 bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-4 justify-between mb-4">
            <div className="flex flex-row gap-4 items-center w-1/3">
              {/* Volunteers Title */}
              <div className="font-bold text-xl">Volunteers</div>

              {/* Search Input */}
              <div className="flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="p-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row gap-2">
              {/* Sort By Dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSortBy(value);
                    if (value === "Newest") {
                      setSortConfig({
                        key: "dateAdded",
                        direction: "descending",
                      });
                    } else if (value === "Oldest") {
                      setSortConfig({
                        key: "dateAdded",
                        direction: "ascending",
                      });
                    } else if (value === "Name") {
                      setSortConfig({
                        key: "name",
                        direction: "ascending",
                      });
                    }
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="Newest">Sort by: Newest</option>
                  <option value="Oldest">Sort by: Oldest</option>
                  <option value="Name">Sort by: Name</option>
                </select>
              </div>

              {/* Filter By Dropdown */}
              <div>
                <label
                  htmlFor="filter-causes"
                  className="mr-2 font-semibold text-gray-700"
                >
                  Filter by: All Causes
                </label>
                <select
                  id="filter-causes"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Filter by: All Causes</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Banking">Banking</option>
                  <option value="Medical">Medical</option>
                  <option value="College admission">College admission</option>
                  <option value="Housing">Housing</option>
                </select>
              </div>
            </div>
          </div>

          {chooseVolunteer && (
            <div className="flex justify-between w-full mb-4">
              <div className="text-md text-gray-500 font-bold flex flex-row gap-4 items-center">
                {`${volunteersCount} Volunteers Requested`}
                {/* Badge with number */}
                <div className="bg-blue-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                  {`${volunteersAssigned} Assigned`}
                </div>
              </div>
              <div className="text-md text-gray-600 font-light">{`${formattedDate}`}</div>
            </div>
          )}

          {/* Table inside a scrollable container */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      onClick={
                        header.key !== "select"
                          ? () => requestSort(header.key)
                          : undefined
                      }
                      className="px-4 py-2 border-b-2 border-gray-200 text-left cursor-pointer"
                    >
                      {header.label}
                      {header.key !== "select" &&
                        sortConfig.key === header.key && (
                          <span>
                            {sortConfig.direction === "ascending"
                              ? " 🔼"
                              : " 🔽"}
                          </span>
                        )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {chooseVolunteer &&
                  paginatedData.map((volunteer, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b">
                        <input
                          type="checkbox"
                          checked={selectedVolunteers.includes(volunteer.email)}
                          onChange={() => handleCheckboxChange(volunteer.email)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">{volunteer.name}</td>
                      <td className="px-4 py-2 border-b">{volunteer.cause}</td>
                      <td className="px-4 py-2 border-b">{volunteer.phone}</td>
                      <td className="px-4 py-2 border-b">{volunteer.email}</td>
                      <td className="px-4 py-2 border-b">
                        {volunteer.location}
                      </td>
                      <td className="px-4 py-2 border-b">{volunteer.rating}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {chooseVolunteer && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing {itemsPerPage * (currentPage - 1) + 1} to{" "}
                {Math.min(itemsPerPage * currentPage, totalRows)} of {totalRows}{" "}
                entries
              </div>
              {/* Items Per Page Selector */}
              <div>
                <label htmlFor="itemsPerPage" className="mr-2">
                  Rows per view:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value={5}>5 rows</option>
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ${
                    currentPage === 1 ? "invisible" : ""
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {paginationButtons}

                <button
                  className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ${
                    currentPage === totalPages ? "invisible" : ""
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpingVolunteers;
