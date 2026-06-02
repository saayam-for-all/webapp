import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getVolunteersData } from "../../services/volunteerServices";
import {
  createZoomMeeting,
  storeMeetingDetails,
} from "../../services/meetingServices";
import { FaVideo } from "react-icons/fa";

const HelpingVolunteers = () => {
  const { t } = useTranslation();

  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetingError, setMeetingError] = useState("");
  const [meetingSuccess, setMeetingSuccess] = useState("");

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
  const [searchBy, setSearchBy] = useState("name");
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [volunteerCountError, setVolunteerCountError] = useState("");

  const [volunteerData, setVolunteerData] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (meetingSuccess) {
      const timer = setTimeout(() => setMeetingSuccess(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [meetingSuccess]);

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

  const systemDate = new Date();

  const formattedDate = systemDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const headers = [
    { key: "select", label: "Select" },
    { key: "name", label: "Name" },
    { key: "cause", label: "Cause" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "rating", label: "Rating" },
  ];

  const handleCheckboxChange = (email) => {
    setSelectedVolunteers((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email],
    );
  };

  const requestSort = (key) => {
    let direction = "ascending";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const filteredAndSortedVolunteers = useMemo(() => {
    let topN = volunteerData.slice(
      0,
      Math.min(volunteerData.length, volunteersCount),
    );

    let filteredVolunteers = topN.filter((volunteer) => {
      return (volunteer.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });

    if (filter) {
      filteredVolunteers = filteredVolunteers.filter((volunteer) =>
        volunteer.cause
          .toLowerCase()
          .includes(filter.toLowerCase()),
      );
    }

    filteredVolunteers.sort((a, b) => {
      if (sortConfig.key === "dateAdded") {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);

        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending"
          ? -1
          : 1;
      }

      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending"
          ? 1
          : -1;
      }

      return 0;
    });

    return filteredVolunteers;
  }, [
    volunteerData,
    searchTerm,
    filter,
    sortConfig,
    volunteersCount,
  ]);

  const totalRows = filteredAndSortedVolunteers.length;

  const totalPages = Math.ceil(totalRows / itemsPerPage);

  const paginatedData = filteredAndSortedVolunteers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const isAllPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((v) =>
      selectedVolunteers.includes(v.email),
    );

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const newSelections = paginatedData
        .map((v) => v.email)
        .filter(
          (email) =>
            !selectedVolunteers.includes(email),
        );

      setSelectedVolunteers((prev) => [
        ...prev,
        ...newSelections,
      ]);
    } else {
      const pageEmails = paginatedData.map(
        (v) => v.email,
      );

      setSelectedVolunteers((prev) =>
        prev.filter(
          (email) => !pageEmails.includes(email),
        ),
      );
    }
  };

  const volunteersAssigned =
    filteredAndSortedVolunteers.length;

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
        <div
          className="text-center py-8 text-lg font-semibold"
          role="status"
        >
          Loading...
        </div>
      )}

      {error && (
        <div
          className="text-red-600 font-semibold px-4 pt-4"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg">
            Volunteer Management
          </div>

          {volunteerCountError && (
            <div className="text-red-600 text-sm font-semibold flex items-center gap-1">
              <span aria-hidden="true">⚠️</span>
              <span>{volunteerCountError}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
            disabled={selectedVolunteers.length === 0}
            onClick={() => setMeetingModalOpen(true)}
          >
            <FaVideo className="text-lg" />
            <span>Zoom Meeting</span>
          </button>

          <button
            className="bg-red-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
            disabled={selectedVolunteers.length === 0}
            onClick={() => {
              setVolunteerData((prev) =>
                prev.filter(
                  (volunteer) =>
                    !selectedVolunteers.includes(
                      volunteer.email,
                    ),
                ),
              );

              setSelectedVolunteers([]);
            }}
          >
            {t("Delete")}
          </button>
        </div>
      </div>

      <div className="bg-gray-100 shadow-md p-1 space-y-4 rounded-b-md">
        <div className="flex items-center space-x-4 p-4 mt-2">
          <input
            type="number"
            min="1"
            max="5"
            placeholder={t("NUMBER_OF_VOLUNTEERS")}
            className="p-3 border rounded-md w-1/3"
            value={volunteersCount}
            onChange={(e) => {
              setVolunteersCount(e.target.value);
              setChooseVolunteer(false);

              if (Number(e.target.value) <= 5) {
                setVolunteerCountError("");
              }
            }}
          />

          <button
            className="bg-blue-500 px-6 py-3 text-white rounded-lg whitespace-nowrap hover:bg-blue-600 flex items-center"
            onClick={() => {
              const requestedCount =
                Number(volunteersCount);

              if (requestedCount > 5) {
                setVolunteerCountError(
                  "Maximum 5 volunteer can be assigned",
                );

                return;
              }

              setVolunteerCountError("");
              setChooseVolunteer(true);
            }}
          >
            {t("REQUEST_VOLUNTEERS")}
          </button>
        </div>

        <div className="mt-6 bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-4 justify-between mb-4">
            <div className="flex flex-row gap-4 items-center w-1/3">
              <div className="font-bold text-xl">
                Volunteers
              </div>

              <div className="flex-grow max-w-md">
                <input
                  type="text"
                  placeholder={t("SEARCH_BY_NAME")}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {chooseVolunteer && (
            <div className="flex justify-between w-full mb-4">
              <div className="text-md text-gray-500 font-bold flex flex-row gap-4 items-center">
                {`${volunteersCount} Volunteers Requested`}

                <div className="bg-blue-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                  {`${volunteersAssigned} Assigned`}
                </div>
              </div>

              <div className="text-md text-gray-600 font-light">
                {formattedDate}
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      onClick={
                        header.key !== "select"
                          ? () =>
                              requestSort(header.key)
                          : undefined
                      }
                      className="px-4 py-2 border-b-2 border-gray-200 text-left cursor-pointer"
                    >
                      {header.key === "select" ? (
                        <input
                          type="checkbox"
                          checked={isAllPageSelected}
                          onChange={
                            handleSelectAllChange
                          }
                          aria-label="Select all volunteers on this page"
                        />
                      ) : (
                        <>
                          {header.label}

                          {sortConfig.key ===
                            header.key && (
                            <span>
                              {sortConfig.direction ===
                              "ascending"
                                ? " 🔼"
                                : " 🔽"}
                            </span>
                          )}
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {chooseVolunteer &&
                  paginatedData.map(
                    (volunteer, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100"
                      >
                        <td className="px-4 py-2 border-b">
                          <input
                            type="checkbox"
                            checked={selectedVolunteers.includes(
                              volunteer.email,
                            )}
                            onChange={() => {
                              handleCheckboxChange(
                                volunteer.email,
                              );
                            }}
                          />
                        </td>

                        <td className="px-4 py-2 border-b">
                          <Link
                            to="/profile"
                            className="text-blue-600 hover:underline"
                          >
                            {volunteer.name}
                          </Link>
                        </td>

                        <td className="px-4 py-2 border-b">
                          {volunteer.cause}
                        </td>

                        <td className="px-4 py-2 border-b">
                          {volunteer.phone}
                        </td>

                        <td className="px-4 py-2 border-b">
                          {volunteer.email}
                        </td>

                        <td className="px-4 py-2 border-b">
                          {volunteer.location}
                        </td>

                        <td className="px-4 py-2 border-b">
                          {volunteer.rating}
                        </td>
                      </tr>
                    ),
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpingVolunteers;