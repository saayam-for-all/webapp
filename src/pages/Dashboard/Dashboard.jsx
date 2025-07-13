import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [statusFilter, setStatusFilter] = useState({
    Open: true,
    Closed: false,
  });
  const [categoryFilter, setCategoryFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
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
        Object.keys(request).some((key) =>
          String(request[key]).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  };

  const filteredData = useMemo(() => {
    return filteredRequests(sortedData);
  }, [sortedData, statusFilter, categoryFilter, searchTerm]);

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

  useEffect(() => {
    if (Object.keys(categoryFilter).length === 0) {
      setCategoryFilter(allCategories);
    }
  }, []);

  const handleStatusBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget))
      setIsStatusDropdownOpen(false);
  };
  const handleFilterBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget))
      setIsCategoryDropdownOpen(false);
  };
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
      <div className="border">
        <div className="flex mb-5">
          {["myRequests", "managedRequests"]
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
          <div className="relative" onBlur={handleStatusBlur} tabIndex={-1}>
            <div
              className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
              onClick={toggleStatusDropdown}
              tabIndex={0}
            >
              <button className="py-2 px-4 p-2 font-light text-gray-600">
                {t("Status")}
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
          <div className="relative" onBlur={handleFilterBlur} tabIndex={-1}>
            <div
              className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
              onClick={toggleCategoryDropdown}
              tabIndex={0}
            >
              <button className="py-2 px-4 p-2 font-light text-gray-600">
                {t("FILTER_BY")}
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
