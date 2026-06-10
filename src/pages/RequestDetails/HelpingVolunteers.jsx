import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaVideo } from "react-icons/fa";

const HelpingVolunteers = () => {
  const { t } = useTranslation();
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
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

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

  const volunteerData = useMemo(
    () => [
      {
        name: "Jane Cooper",
        cause: "Cooking",
        phone: "(225) 555-0118",
        email: "jane@microsoft.com",
        location: "Boston, USA",
        rating: "★★★★★",
        dateAdded: "2023-10-01",
      },
      {
        name: "Floyd Miles",
        cause: "Banking",
        phone: "(205) 555-0100",
        email: "floyd@yahoo.com",
        location: "New York, USA",
        rating: "★★★☆☆",
        dateAdded: "2023-09-25",
      },
      {
        name: "Ronald Richards",
        cause: "Medical",
        phone: "(302) 555-0107",
        email: "ronald@adobe.com",
        location: "Brasilia, Brazil",
        rating: "★★★★☆",
        dateAdded: "2023-10-05",
      },
      {
        name: "Marvin McKinney",
        cause: "College admission",
        phone: "(252) 555-0126",
        email: "marvin@tesla.com",
        location: "Delhi, India",
        rating: "★★★★★",
        dateAdded: "2023-09-30",
      },
      {
        name: "Jerome Bell",
        cause: "Housing",
        phone: "(629) 555-0129",
        email: "jerome@google.com",
        location: "Texas, USA",
        rating: "★★★☆☆",
        dateAdded: "2023-10-10",
      },
      {
        name: "Kathryn Murphy",
        cause: "Cooking",
        phone: "(406) 555-0120",
        email: "kathryn@microsoft.com",
        location: "Chicago, USA",
        rating: "★★☆☆☆",
        dateAdded: "2023-10-08",
      },
    ],
    [],
  );

  const headers = [
    { key: "name", label: "Name" },
    { key: "cause", label: "Cause" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "rating", label: "Rating" },
  ];

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

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
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      }
    });

    return filteredVolunteers;
  }, [volunteerData, searchTerm, filter, sortConfig, volunteersCount]);

  const totalRows = filteredAndSortedVolunteers.length;
  const totalPages = Math.ceil(totalRows / itemsPerPage);

  const paginatedData = filteredAndSortedVolunteers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
            {/* Left: Title + Search */}
            <div className="flex flex-row gap-4 items-center w-1/3">
              <div className="font-bold text-xl">Volunteers</div>
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

            {/* Right: Sort + Filter + Zoom + Delete */}
            <div className="flex flex-row gap-2 items-center">
              {/* Sort By Dropdown */}
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
                    setSortConfig({ key: "dateAdded", direction: "ascending" });
                  } else if (value === "Name") {
                    setSortConfig({ key: "name", direction: "ascending" });
                  }
                }}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="Newest">Sort by: Newest</option>
                <option value="Oldest">Sort by: Oldest</option>
                <option value="Name">Sort by: Name</option>
              </select>

              {/* Filter By Dropdown */}
              <select
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

              {/* Zoom Button */}
              <button
                className="px-3 py-2 bg-violet-300 hover:bg-violet-400 text-white rounded-md flex items-center gap-2"
                title="Zoom"
                onClick={() => {}}
              >
                <FaVideo size={16} />
                <span>Zoom meeting</span>
              </button>

              {/* Delete Button */}
              <button
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-2"
                title="Delete"
                onClick={() => {}}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Delete</span>
              </button>
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
              <div className="text-md text-gray-600 font-light">{`${formattedDate}`}</div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      onClick={() => requestSort(header.key)}
                      className="px-4 py-2 border-b-2 border-gray-200 text-left cursor-pointer"
                    >
                      {header.label}
                      {sortConfig.key === header.key && (
                        <span>
                          {sortConfig.direction === "ascending" ? " 🔼" : " 🔽"}
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

          {chooseVolunteer && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing {itemsPerPage * (currentPage - 1) + 1} to{" "}
                {Math.min(itemsPerPage * currentPage, totalRows)} of {totalRows}{" "}
                entries
              </div>
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
                  className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ${currentPage === 1 ? "invisible" : ""}`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {paginationButtons}
                <button
                  className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ${currentPage === totalPages ? "invisible" : ""}`}
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
