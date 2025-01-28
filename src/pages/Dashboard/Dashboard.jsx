import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../common/components/DataTable/Table";
// import { requestsData } from "./data";
import { MdArrowForwardIos } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Dashboard = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState("myRequests");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "creationDate",
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState({
    Open: true,
    Closed: false,
  });
  const [categoryFilter, setCategoryFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [requestData, setRequestData] = useState([]);

  const token = useSelector((state) => state.auth.idToken);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "https://a9g3p46u59.execute-api.us-east-1.amazonaws.com/saayam/dev/requests/v0.0.1/get-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequestData(response.data.body);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRequests();
  }, [token]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const headers = [
    "id",
    "type",
    "subject",
    "creationDate",
    "closedDate",
    "status",
    "category",
    "priority",
    "calamity",
  ];

  const sortedRequests = (requests) => {
    let sortableRequests = [...requests];
    if (sortConfig !== null) {
      sortableRequests.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRequests;
  };

  const filteredRequests = (requests) => {
    // setCrrrentSorting(requests);
    return sortedRequests(requests).filter(
      (request) =>
        (Object.keys(statusFilter).length === 0 ||
          statusFilter[request.status]) &&
        (Object.keys(categoryFilter).length === 0 ||
          categoryFilter[request.category]) &&
        Object.keys(request).some((key) =>
          String(request[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  const totalPages = (requests) => {
    return Math.ceil(filteredRequests(requests).length / rowsPerPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusChange = (status) => {
    setStatusFilter((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter((prev) => {
      const newFilter = { ...prev };
      if (category === "All") {
        if (
          Object.keys(newFilter).length === Object.keys(allCategories).length
        ) {
          return {};
        } else {
          return allCategories;
        }
      } else {
        if (newFilter[category]) {
          delete newFilter[category];
        } else {
          newFilter[category] = true;
        }

        if (
          Object.keys(newFilter).length ===
          Object.keys(allCategories).length - 1
        ) {
          newFilter["All"] = true;
        } else {
          delete newFilter["All"];
        }

        return newFilter;
      }
    });
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const allCategories = {
    All: true,
    Logistics: true,
    Maintenance: true,
    Education: true,
    Electronics: true,
    Health: true,
    Essentials: true,
    Childcare: true,
    Pets: true,
    Shopping: true,
    Charity: true,
    Events: true,
    Marketing: true,
    Administration: true,
    Research: true,
  };

  useEffect(() => {
    if (Object.keys(categoryFilter).length === 0) {
      setCategoryFilter(allCategories);
    }
  }, []);

  // const requests = requestData

  return (
    <div className="p-5">
      <div className="flex gap-10 mb-5">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          <Link to="/request" className="text-white">
            Create Help Request
          </Link>
        </button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          <Link to="/promote-to-volunteer" className="text-white">
            Become a Volunteer
          </Link>
        </button>
        <div className="flex ml-auto gap-2 items-center">
          <button className="text-blue-500 font-semibold underline italic py-2">
            Administrate
          </button>
          <MdArrowForwardIos className="text-blue-500" />
        </div>
      </div>

      <div className="border">
        <div className="flex mb-5">
          {["myRequests", "othersRequests", "managedRequests"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
                activeTab === tab
                  ? "bg-white border-gray-300"
                  : "bg-gray-300 border-transparent"
              } ${tab !== "managedRequests" ? "mr-1" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === "myRequests"
                ? "My Requests"
                : tab === "othersRequests"
                ? "Others Requests"
                : "Managed Requests"}
            </button>
          ))}
        </div>

        <div className="mb-4 flex gap-2 px-10">
          <div className="relative mr-auto w-1/2">
            <IoSearchOutline
              className="text-gray-500 absolute inset-y-0 start-0 flex items-center m-3 my-2"
              size={22}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 rounded-md flex-grow block w-full ps-10 bg-gray-50"
            />
          </div>
          <div className="relative">
            <div
              className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
              onClick={toggleStatusDropdown}
            >
              <button className="py-2 px-4 p-2 font-light text-gray-600">
                Status
              </button>
              <IoIosArrowDown className="m-2" />
            </div>
            {isStatusDropdownOpen && (
              <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10">
                {Object.keys(statusFilter).map((status) => (
                  <label key={status} className="block">
                    <input
                      type="checkbox"
                      checked={statusFilter[status]}
                      onChange={() => handleStatusChange(status)}
                    />
                    {status}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <div
              className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
              onClick={toggleCategoryDropdown}
            >
              <button className="py-2 px-4 p-2 font-light text-gray-600">
                Filter by
              </button>
              <IoIosArrowDown className="m-2" />
            </div>
            {isCategoryDropdownOpen && (
              <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10">
                <label className="block">
                  <input
                    type="checkbox"
                    checked={
                      Object.keys(categoryFilter).length ===
                      Object.keys(allCategories).length
                    }
                    onChange={() => handleCategoryChange("All")}
                  />
                  All Categories
                </label>
                {Object.keys(allCategories)
                  .filter((cat) => cat !== "All")
                  .map((category) => (
                    <label key={category} className="block">
                      <input
                        type="checkbox"
                        checked={categoryFilter[category] || false}
                        onChange={() => handleCategoryChange(category)}
                      />
                      {category}
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>

        {activeTab && (
          <div className="requests-section">
            <Table
              headers={headers}
              rows={filteredRequests(requestData)}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages(requestData)}
              totalRows={filteredRequests(requestData).length}
              itemsPerPage={rowsPerPage}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onRowsPerPageChange={handleRowsPerPageChange}
              getLinkPath={(request, header) => `/request/${request[header]}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
