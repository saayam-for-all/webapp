import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import Table from "../../common/components/DataTable/Table";
// import { requestsData } from "./data";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import the CSS

// import { useGetAllRequestQuery } from "../../services/requestApi";

import {
  getManagedRequests,
  getMyRequests,
  getOthersRequests,
} from "../../services/requestServices";
import "./Dashboard.css";

const Dashboard = ({ userRole }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location.state?.successMessage]);
  const [activeTab, setActiveTab] = useState("myRequests");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "creationDate",
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState({});
  const [categoryFilter, setCategoryFilter] = useState({});
  const [typeFilter, setTypeFilter] = useState({});
  const [priorityFilter, setPriorityFilter] = useState({});
  const [calamityFilter, setCalamityFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isCalamityDropdownOpen, setIsCalamityDropdownOpen] = useState(false);
  const [data, setData] = useState({});
  const groups = useSelector((state) => state.auth.user?.groups);
  const isLoading = false;
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // const { data, isLoading } = useGetAllRequestQuery();

  const getAllRequests = async (activeTab) => {
    try {
      let requestApi = getMyRequests;
      if (activeTab === "othersRequests") requestApi = getOthersRequests;
      else if (activeTab === "managedRequests") requestApi = getManagedRequests;
      const response = await requestApi();
      setData(response);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    toggleDropdown();
  }, []);

  useEffect(() => {
    getAllRequests(activeTab);
  }, [activeTab]);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setStatusFilter({});
    setCategoryFilter(allCategories);
    setTypeFilter({});
    setPriorityFilter({});
    setCalamityFilter({});
    setSearchTerm("");
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

  const sortedData = useMemo(() => {
    return sortedRequests(data?.body || []);
  }, [data, sortConfig]);

  const filteredRequests = (requests) => {
    // setCrrrentSorting(requests);
    // console.log(requests);
    return requests.filter(
      (request) =>
        (Object.keys(statusFilter).length === 0 ||
          statusFilter[request.status]) &&
        (Object.keys(categoryFilter).length === 0 ||
          categoryFilter[request.category]) &&
        (Object.keys(typeFilter).length === 0 || typeFilter[request.type]) &&
        (Object.keys(priorityFilter).length === 0 ||
          priorityFilter[request.priority]) &&
        (Object.keys(calamityFilter).length === 0 ||
          calamityFilter[request.calamity]) &&
        Object.keys(request).some((key) =>
          String(request[key]).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  };

  const filteredData = useMemo(() => {
    return filteredRequests(sortedData);
  }, [
    sortedData,
    statusFilter,
    categoryFilter,
    typeFilter,
    priorityFilter,
    calamityFilter,
    searchTerm,
  ]);

  const totalPages = (filteredData) => {
    if (!filteredData || filteredData.length == 0) return 1;
    return Math.ceil(filteredData.length / rowsPerPage);
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
    setStatusFilter((prev) => {
      const newFilter = { ...prev };
      if (newFilter[status]) {
        delete newFilter[status];
      } else {
        newFilter[status] = true;
      }
      return newFilter;
    });
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter((prev) => {
      const newFilter = { ...prev };
      if (newFilter[category]) {
        delete newFilter[category];
      } else {
        newFilter[category] = true;
      }
      return newFilter;
    });
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setTypeFilter((prev) => {
      const newFilter = { ...prev };
      if (newFilter[type]) {
        delete newFilter[type];
      } else {
        newFilter[type] = true;
      }
      return newFilter;
    });
    setCurrentPage(1);
  };

  const handlePriorityChange = (priority) => {
    setPriorityFilter((prev) => {
      const newFilter = { ...prev };
      if (newFilter[priority]) {
        delete newFilter[priority];
      } else {
        newFilter[priority] = true;
      }
      return newFilter;
    });
    setCurrentPage(1);
  };

  const handleCalamityChange = (calamity) => {
    setCalamityFilter((prev) => {
      const newFilter = { ...prev };
      if (newFilter[calamity]) {
        delete newFilter[calamity];
      } else {
        newFilter[calamity] = true;
      }
      return newFilter;
    });
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const toggleTypeDropdown = () => {
    setIsTypeDropdownOpen(!isTypeDropdownOpen);
  };

  const togglePriorityDropdown = () => {
    setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
  };

  const toggleCalamityDropdown = () => {
    setIsCalamityDropdownOpen(!isCalamityDropdownOpen);
  };

  const navigate = useNavigate();

  const [hasAddress, setHasAddress] = useState(
    localStorage.getItem("addressFlag") === "true",
  );

  useEffect(() => {
    setHasAddress(localStorage.getItem("addressFlag") === "true");
  }, [location]);

  const handleStatusBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget))
      setIsStatusDropdownOpen(false);
  };
  const handleFilterBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget))
      setIsCategoryDropdownOpen(false);
  };
  const handleTypeBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget))
      setIsTypeDropdownOpen(false);
  };
  const handlePriorityBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget))
      setIsPriorityDropdownOpen(false);
  };
  const handleCalamityBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget))
      setIsCalamityDropdownOpen(false);
  };
  // const requests = requestData
  const [showAddressMsg, setShowAddressMsg] = useState(false);

  return (
    <div className="p-5">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
      />
      <div className="flex gap-10 mb-5">
        <Link
          to="/request"
          onClick={(e) => {
            if (!hasAddress) {
              e.preventDefault();
              setShowAddressMsg(true);
            }
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
          style={{ color: "white", textDecoration: "none" }}
        >
          <span className="hover:underline">{t("CREATE_HELP_REQUEST")}</span>
        </Link>
        {!groups?.includes("Volunteers") && (
          <Link
            to="/promote-to-volunteer"
            onClick={(e) => {
              if (!hasAddress) {
                e.preventDefault();
                setShowAddressMsg(true);
              }
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
            style={{ color: "white", textDecoration: "none" }}
          >
            <span className="hover:underline">{t("BECOME_VOLUNTEER")}</span>
          </Link>
        )}
        <div className="flex ml-auto gap-2 items-center">
          {isDropdownVisible && (
            <select className="text-blue-500 font-semibold underline italic py-2">
              <option value="superAdmin">Super Admin Dashboard</option>
              <option value="admin">Admin Dashboard</option>
              <option value="steward">Steward Dashboard</option>
              <option value="volunteer">Volunteer Dashboard</option>
              <option value="beneficiary">Beneficiary Dashboard</option>
            </select>
          )}
        </div>
      </div>
      {showAddressMsg && !hasAddress && (
        <p className="text-red-600 mb-2">
          Please add your address in Profile to continue.&nbsp;
          <Link
            to="/profile"
            state={{ tab: "personal", edit: "true" }}
            className="underline"
          >
            Edit profile
          </Link>
        </p>
      )}
      {successMessage && (
        <div className="relative bg-green-100 text-green-700 p-3 mb-5 rounded-md text-center font-semibold">
          {successMessage}
          <button
            onClick={() => setSuccessMessage("")}
            className="absolute top-2 right-4 text-green-700 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}
      <div className="border">
        <div className="flex mb-5">
          {["myRequests", "othersRequests", "managedRequests"]
            .filter(
              (tab) =>
                !(tab === "managedRequests" && !groups?.includes("Volunteers")),
            )
            .map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
                  activeTab === tab
                    ? "bg-white border-gray-300"
                    : "bg-gray-300 border-transparent hover:bg-gray-200"
                } ${tab !== "managedRequests" ? "mr-1" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab === "myRequests"
                  ? t("MY_REQUESTS")
                  : tab === "othersRequests"
                    ? t("OTHERS_REQUESTS")
                    : t("MANAGED_REQUESTS")}
              </button>
            ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-3 px-4 sm:px-6 lg:px-10 items-end">
          <div className="relative flex-1 min-w-0 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IoSearchOutline className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by subject, type, or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <div className="relative" onBlur={handleStatusBlur} tabIndex={-1}>
              <div
                className="bg-blue-50 hover:bg-blue-100 flex items-center rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-all duration-200 px-3 py-2 min-w-0"
                onClick={toggleStatusDropdown}
                tabIndex={0}
              >
                <button className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {t("Status")}
                  <IoIosArrowDown className="text-gray-500" size={16} />
                </button>
              </div>
              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={statusFilter["Open"] || false}
                      onChange={() => handleStatusChange("Open")}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">Open</span>
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={statusFilter["Closed"] || false}
                      onChange={() => handleStatusChange("Closed")}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">Closed</span>
                  </label>
                </div>
              )}
            </div>
            <div className="relative" onBlur={handleFilterBlur} tabIndex={-1}>
              <div
                className="bg-blue-50 hover:bg-blue-100 flex items-center rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-all duration-200 px-3 py-2 min-w-0"
                onClick={toggleCategoryDropdown}
                tabIndex={0}
              >
                <button className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {t("Category")}
                  <IoIosArrowDown className="text-gray-500" size={16} />
                </button>
              </div>
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 max-h-64 overflow-y-auto">
                  {Object.keys(allCategories)
                    .filter((cat) => cat !== "All")
                    .map((category) => (
                      <label
                        key={category}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={categoryFilter[category] || false}
                          onChange={() => handleCategoryChange(category)}
                          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">
                          {category}
                        </span>
                      </label>
                    ))}
                </div>
              )}
            </div>
            <div className="relative" onBlur={handleTypeBlur} tabIndex={-1}>
              <div
                className="bg-blue-50 hover:bg-blue-100 flex items-center rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-all duration-200 px-3 py-2 min-w-0"
                onClick={toggleTypeDropdown}
                tabIndex={0}
              >
                <button className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {t("Type")}
                  <IoIosArrowDown className="text-gray-500" size={16} />
                </button>
              </div>
              {isTypeDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={typeFilter["Personal"] || false}
                      onChange={() => handleTypeChange("Personal")}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">Personal</span>
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={typeFilter["For Others"] || false}
                      onChange={() => handleTypeChange("For Others")}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">For Others</span>
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={typeFilter["Managed"] || false}
                      onChange={() => handleTypeChange("Managed")}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">Managed</span>
                  </label>
                </div>
              )}
            </div>
            <div className="relative" onBlur={handlePriorityBlur} tabIndex={-1}>
              <div
                className="bg-blue-50 hover:bg-blue-100 flex items-center rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-all duration-200 px-3 py-2 min-w-0"
                onClick={togglePriorityDropdown}
                tabIndex={0}
              >
                <button className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {t("Priority")}
                  <IoIosArrowDown className="text-gray-500" size={16} />
                </button>
              </div>
              {isPriorityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={priorityFilter["High"] || false}
                      onChange={() => handlePriorityChange("High")}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">High</span>
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={priorityFilter["Medium"] || false}
                      onChange={() => handlePriorityChange("Medium")}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">Medium</span>
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={priorityFilter["Low"] || false}
                      onChange={() => handlePriorityChange("Low")}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">Low</span>
                  </label>
                </div>
              )}
            </div>
            <div className="relative" onBlur={handleCalamityBlur} tabIndex={-1}>
              <div
                className="bg-blue-50 hover:bg-blue-100 flex items-center rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-all duration-200 px-3 py-2 min-w-0"
                onClick={toggleCalamityDropdown}
                tabIndex={0}
              >
                <button className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {t("Calamity")}
                  <IoIosArrowDown className="text-gray-500" size={16} />
                </button>
              </div>
              {isCalamityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={calamityFilter["None"] || false}
                      onChange={() => handleCalamityChange("None")}
                      className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">None</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTab && (
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
                onRowsPerPageChange={handleRowsPerPageChange}
                getLinkPath={(request, header) => `/request/${request[header]}`}
                getLinkState={(request) => request}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
