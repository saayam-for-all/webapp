import React, { useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import ScrollableTable from "../../common/components/DataTable/ScrollableTable";
import useScrollableData from "../../hooks/useScrollableData";
// import { requestsData } from "./data";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import the CSS
import { getAuthStatus, getDefaultGroups } from "../../utils/authUtils";

// import { useGetAllRequestQuery } from "../../services/requestApi";

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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const rawGroups = useSelector((state) => state.auth.user?.groups);
  const authStatus = getAuthStatus(rawGroups);
  const groups = authStatus.isAuthenticated
    ? authStatus.groups
    : getDefaultGroups();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Use the new scrollable data hook
  const {
    data: scrollableData,
    isLoading,
    hasMore,
    totalRows,
    error,
    loadMore,
    refetch,
  } = useScrollableData(
    groups,
    activeTab,
    searchTerm,
    statusFilter,
    categoryFilter,
  );

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    toggleDropdown();
  }, []);

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
    setStatusFilter({
      Open: true,
      Closed: false,
    });
    setCategoryFilter(allCategories);
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

  const filteredData = useMemo(() => {
    return scrollableData.filter((request) => {
      // Status filter
      const statusMatch =
        Object.keys(statusFilter).length === 0 || statusFilter[request.status];

      // Category filter
      const categoryMatch =
        Object.keys(categoryFilter).length === 0 ||
        categoryFilter[request.category];

      // Search filter
      const searchMatch =
        !searchTerm ||
        Object.keys(request).some((key) =>
          String(request[key]).toLowerCase().includes(searchTerm.toLowerCase()),
        );

      return statusMatch && categoryMatch && searchMatch;
    });
  }, [scrollableData, statusFilter, categoryFilter, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableRequests = [...filteredData];
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
  }, [filteredData, sortConfig]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
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
        <Link
          to="/request"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
          style={{ color: "white", textDecoration: "none" }}
        >
          <span className="hover:underline">{t("CREATE_HELP_REQUEST")}</span>
        </Link>
        {!groups?.includes("Volunteers") && (
          <Link
            to="/promote-to-volunteer"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
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

      {!authStatus.isAuthenticated && (
        <div className="relative bg-yellow-100 text-yellow-700 p-3 mb-5 rounded-md text-center font-semibold">
          ⚠️ Authentication not fully configured. Some features may be limited.
          <button
            onClick={() => window.location.reload()}
            className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
          >
            Refresh
          </button>
        </div>
      )}
      <div className="border">
        <div className="flex mb-5">
          {(() => {
            const isAdmin =
              groups?.includes("SystemAdmins") ||
              groups?.includes("Admins") ||
              groups?.includes("Stewards");
            const isVolunteer = groups?.includes("Volunteers");

            let availableTabs = [];

            if (isAdmin) {
              // Admins see all requests (using myRequests tab but with all data)
              availableTabs = ["myRequests"];
            } else if (isVolunteer) {
              // Volunteers see their own requests and managed requests
              availableTabs = ["myRequests", "managedRequests"];
            } else {
              // Beneficiaries see their own requests and others' requests
              availableTabs = ["myRequests", "othersRequests"];
            }

            return availableTabs.map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-center cursor-pointer border-b-2 font-bold ${
                  activeTab === tab
                    ? "bg-white border-gray-300"
                    : "bg-gray-300 border-transparent hover:bg-gray-200"
                } ${tab !== "managedRequests" ? "mr-1" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {(() => {
                  const isAdmin =
                    groups?.includes("SystemAdmins") ||
                    groups?.includes("Admins") ||
                    groups?.includes("Stewards");

                  if (isAdmin && tab === "myRequests") {
                    return "All Requests"; // Admins see all requests
                  } else if (tab === "myRequests") {
                    return t("MY_REQUESTS");
                  } else if (tab === "othersRequests") {
                    return t("OTHERS_REQUESTS");
                  } else if (tab === "managedRequests") {
                    return t("MANAGED_REQUESTS");
                  }
                  return tab;
                })()}
              </button>
            ));
          })()}
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
                {t("Status")}
              </button>
              <IoIosArrowDown className="m-2" />
            </div>
            {isStatusDropdownOpen && (
              <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-50 min-w-32">
                {Object.keys(statusFilter).map((status) => (
                  <label key={status} className="block">
                    <input
                      type="checkbox"
                      checked={statusFilter[status]}
                      onChange={() => handleStatusChange(status)}
                      className="mr-2"
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
                {t("FILTER_BY")}
              </button>
              <IoIosArrowDown className="m-2" />
            </div>
            {isCategoryDropdownOpen && (
              <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-50 min-w-40 max-h-60 overflow-y-auto">
                <label className="block">
                  <input
                    type="checkbox"
                    checked={
                      Object.keys(categoryFilter).length ===
                      Object.keys(allCategories).length
                    }
                    onChange={() => handleCategoryChange("All")}
                    className="mr-2"
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
                        className="mr-2"
                      />
                      {category}
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>

        {activeTab && (
          <div className="requests-section table-height-fix">
            <ScrollableTable
              headers={headers}
              rows={sortedData}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={isLoading}
              totalRows={filteredData.length}
              getLinkPath={(request, header) => `/request/${request[header]}`}
              getLinkState={(request) => request}
            />
            {error && (
              <div className="text-center py-4 text-red-600">
                Error loading data: {error}
                <button
                  onClick={refetch}
                  className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
