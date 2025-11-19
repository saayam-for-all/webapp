import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./views/AdminDashboard";
import BeneficiaryDashboard from "./views/BeneficiaryDashboard";
import StewardDashboard from "./views/StewardDashboard";
import SuperAdminDashboard from "./views/SuperAdminDashboard";
import VolunteerDashboard from "./views/VolunteerDashboard";

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
  // which dashboard to show; empty string means show requests view (existing behavior)
  const [selectedDashboard, setSelectedDashboard] = useState("");

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const TYPE_IN_PERSON = "In-person";
  const TYPE_REMOTE = "Remote";

  const normalizeType = (val) => {
    if (!val) return null;
    const s = String(val).trim().toLowerCase();
    const remoteKeywords = ["remote", "virtual", "work from home", "wfh"];
    if (remoteKeywords.some((kw) => s === kw || s.includes(kw)))
      return TYPE_REMOTE;
    return TYPE_IN_PERSON;
  };

  // Simple dummy data per dashboard for initial UI; we'll replace with real data later
  const dashboardTables = useMemo(
    () => ({
      superAdmin: {
        headers: ["id", "metric", "value"],
        rows: [
          { id: "S1", metric: "Total Users", value: "1,200" },
          { id: "S2", metric: "Open Requests", value: 35 },
          { id: "S3", metric: "Volunteers", value: 210 },
        ],
      },
      admin: {
        headers: ["id", "team", "activeTasks"],
        rows: [
          { id: "A1", team: "Support", activeTasks: 12 },
          { id: "A2", team: "Operations", activeTasks: 8 },
        ],
      },
      steward: {
        headers: ["id", "area", "assigned"],
        rows: [
          { id: "ST1", area: "North Zone", assigned: 5 },
          { id: "ST2", area: "East Zone", assigned: 3 },
        ],
      },
      volunteer: {
        headers: ["id", "name", "hoursLogged"],
        rows: [
          { id: "V1", name: "Priya", hoursLogged: 24 },
          { id: "V2", name: "Arjun", hoursLogged: 18 },
        ],
      },
      beneficiary: {
        headers: ["id", "name", "supportReceived"],
        rows: [
          { id: "B1", name: "Family A", supportReceived: "Food Pack" },
          { id: "B2", name: "Family B", supportReceived: "Medical Aid" },
        ],
      },
    }),
    [],
  );

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
    const storedDashboard = localStorage.getItem("lastDashboardSelected");
    if (storedDashboard) {
      setSelectedDashboard(storedDashboard);
    } else if (!selectedDashboard && groups) {
      if (groups.includes("Volunteers")) setSelectedDashboard("volunteer");
      else setSelectedDashboard("beneficiary");
    }
  }, [groups]);

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
    if (tab === "analytics") setAnalyticsSubtab("Infrastructure");
    setCurrentPage(1);
    setStatusFilter({
      Open: true,
      Closed: false,
    });
    setCategoryFilter(allCategories);
  };

  const headersWithStatus = useMemo(() => {
    const baseHeaders = [
      "id",
      "type",
      "subject",
      "creationDate",
      "closedDate",
      "category",
      "priority",
      "calamity",
    ];
    const isAllSelected = Object.values(statusFilter).every(Boolean);
    return isAllSelected ? ["status", ...baseHeaders] : baseHeaders;
  }, [statusFilter]);

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

  // Dynamic filter options based on backend data
  const statusOptions = useMemo(() => {
    const values = [
      ...new Set((data?.body || []).map((r) => r.status).filter(Boolean)),
    ];
    const fallback = ["Open", "Closed"];
    const options = values.length ? values : fallback;
    return ["All", ...options];
  }, [data]);

  const categoryOptions = useMemo(() => {
    const backendValues = new Set(
      (data?.body || []).map((r) => r.category).filter(Boolean),
    );
    const defaultValues = Object.keys(allCategories).filter((c) => c !== "All");
    // merge & remove duplicates
    const combined = Array.from(new Set([...defaultValues, ...backendValues]));
    return combined.sort();
  }, [data]);

  // Updated fallback aligned with backend values
  const typeOptions = useMemo(() => {
    const rawValues = (data?.body || []).map((r) => r.type).filter(Boolean);

    const normalizedSet = new Set(
      rawValues.map((v) => normalizeType(v)).filter(Boolean),
    );
    normalizedSet.add(TYPE_IN_PERSON);
    normalizedSet.add(TYPE_REMOTE);
    return [TYPE_IN_PERSON, TYPE_REMOTE].filter((l) => normalizedSet.has(l));
  }, [data]);

  const priorityOptions = useMemo(() => {
    const values = [
      ...new Set((data?.body || []).map((r) => r.priority).filter(Boolean)),
    ];
    return values.length ? values : ["LOW", "MEDIUM", "HIGH"];
  }, [data]);

  const calamityOptions = useMemo(() => {
    const values = [
      ...new Set((data?.body || []).map((r) => r.calamity).filter(Boolean)),
    ];
    // Normalize to Yes / None for boolean or string variations
    const normalized = values.map((v) =>
      v === true || v === "Yes" || v === "yes"
        ? "Yes"
        : v === false || v === "None" || v === "no"
          ? "None"
          : v,
    );
    return normalized.length ? normalized : ["Yes", "None"];
  }, [data]);

  const filteredRequests = (requests) => {
    return requests.filter((request) => {
      const statusActive =
        Object.keys(statusFilter).length === 0 ||
        Object.values(statusFilter).every((v) => !v) ||
        statusFilter[request.status];

      const categoryActive =
        Object.keys(categoryFilter).length === 0 ||
        Object.values(categoryFilter).every((v) => !v) ||
        categoryFilter[request.category];

      const typeNormalized = normalizeType(request.type);

      const typeActive =
        Object.keys(typeFilter).length === 0 ||
        Object.values(typeFilter).every((v) => !v) ||
        (typeNormalized && typeFilter[typeNormalized]);

      const priorityActive =
        Object.keys(priorityFilter).length === 0 ||
        Object.values(priorityFilter).every((v) => !v) ||
        priorityFilter[request.priority];

      const calamityValue =
        request.calamity === true ||
        request.calamity === "Yes" ||
        request.calamity === "yes"
          ? "Yes"
          : "None";

      const calamityActive =
        Object.keys(calamityFilter).length === 0 ||
        Object.values(calamityFilter).every((v) => !v) ||
        calamityFilter[calamityValue];

      const matchesSearch = Object.keys(request).some((key) =>
        String(request[key]).toLowerCase().includes(searchTerm.toLowerCase()),
      );

      return (
        statusActive &&
        categoryActive &&
        typeActive &&
        priorityActive &&
        calamityActive &&
        matchesSearch
      );
    });
  };

  const [typeFilter, setTypeFilter] = useState({
    [TYPE_IN_PERSON]: true,
    [TYPE_REMOTE]: true,
  });

  const [priorityFilter, setPriorityFilter] = useState({});
  const [calamityFilter, setCalamityFilter] = useState({});
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isCalamityDropdownOpen, setIsCalamityDropdownOpen] = useState(false);

  const toggleTypeDropdown = () => setIsTypeDropdownOpen(!isTypeDropdownOpen);
  const togglePriorityDropdown = () =>
    setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
  const toggleCalamityDropdown = () =>
    setIsCalamityDropdownOpen(!isCalamityDropdownOpen);

  const filteredData = useMemo(() => {
    return filteredRequests(sortedData);
  }, [
    sortedData,
    statusFilter,
    categoryFilter,
    searchTerm,
    typeFilter,
    priorityFilter,
    calamityFilter,
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
    if (status === "All") {
      const allSelected = !Object.values(statusFilter).every(Boolean);
      const updatedFilter = {};
      statusOptions.forEach((s) => {
        if (s !== "All") updatedFilter[s] = allSelected;
      });
      setStatusFilter(updatedFilter);
    } else {
      setStatusFilter((prev) => ({
        ...prev,
        [status]: !prev[status],
      }));
    }
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

  const [hasAddress, setHasAddress] = useState(
    localStorage.getItem("addressFlag") === "true",
  );

  useEffect(() => {
    setHasAddress(localStorage.getItem("addressFlag") === "true");
  }, [location]);

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

  const [showAddressMsg, setShowAddressMsg] = useState(false);

  // If a dashboard is selected, use its dummy data; otherwise null -> show requests view
  const selectedDashboardData = selectedDashboard
    ? dashboardTables[selectedDashboard]
    : null;

  let dashboardTitle = "Beneficiary Dashboard";
  if (selectedDashboard === "superAdmin")
    dashboardTitle = "Super Admin Dashboard";
  else if (selectedDashboard === "admin") dashboardTitle = "Admin Dashboard";
  else if (selectedDashboard === "steward")
    dashboardTitle = "Steward Dashboard";
  else if (selectedDashboard === "volunteer")
    dashboardTitle = "Volunteer Dashboard";

  const dashboardDefaultTab = {
    superAdmin: "analytics",
    admin: "analytics",
    steward: "myRequests",
    volunteer: "managedRequests",
    beneficiary: "myRequests",
  };

  useEffect(() => {
    if (selectedDashboard && dashboardDefaultTab[selectedDashboard]) {
      setActiveTab(dashboardDefaultTab[selectedDashboard]);
    }
  }, [selectedDashboard]);

  const dashboardSearchFilters = (
    <>
      <div className="mb-4 flex flex-wrap gap-2 px-10">
        <div className="relative w-1/3">
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
      </div>
      <div className="mb-4 flex flex-wrap gap-2 px-10">
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
              {statusOptions.map((status) => (
                <label key={status} className="block">
                  <input
                    type="checkbox"
                    checked={
                      status === "All"
                        ? Object.values(statusFilter).every(Boolean)
                        : statusFilter[status] || false
                    }
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
              {categoryOptions.map((category) => (
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

        {/* NEW FILTERS START HERE */}
        <div className="relative" onBlur={handleTypeBlur} tabIndex={-1}>
          <div
            className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
            onClick={toggleTypeDropdown}
            tabIndex={0}
          >
            <button className="py-2 px-4 p-2 font-light text-gray-600">
              Type
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isTypeDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10">
              {typeOptions.map((type) => (
                <label key={type} className="block">
                  <input
                    type="checkbox"
                    checked={typeFilter[type] || false}
                    onChange={() =>
                      setTypeFilter((prev) => ({
                        ...prev,
                        [type]: !prev[type],
                      }))
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="relative" onBlur={handlePriorityBlur} tabIndex={-1}>
          <div
            className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
            onClick={togglePriorityDropdown}
          >
            <button className="py-2 px-4 p-2 font-light text-gray-600">
              Priority
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isPriorityDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10">
              {priorityOptions.map((priority) => (
                <label key={priority} className="block">
                  <input
                    type="checkbox"
                    checked={priorityFilter[priority] || false}
                    onChange={() =>
                      setPriorityFilter((prev) => ({
                        ...prev,
                        [priority]: !prev[priority],
                      }))
                    }
                  />
                  {priority}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="relative" onBlur={handleCalamityBlur} tabIndex={-1}>
          <div
            className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
            onClick={toggleCalamityDropdown}
          >
            <button className="py-2 px-4 p-2 font-light text-gray-600">
              Calamity
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isCalamityDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10">
              {calamityOptions.map((cal) => (
                <label key={cal} className="block">
                  <input
                    type="checkbox"
                    checked={calamityFilter[cal] || false}
                    onChange={() =>
                      setCalamityFilter((prev) => ({
                        ...prev,
                        [cal]: !prev[cal],
                      }))
                    }
                  />
                  {cal}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Analytics Sub Tabs

  const [analyticsSubtab, setAnalyticsSubtab] = useState("Infrastructure");

  return (
    <div className="p-5">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
      />
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
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
          {!groups?.includes("Volunteers") &&
            selectedDashboard !== "volunteer" && (
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
        </div>

        <div className="flex items-center gap-2">
          <div className="flex ml-auto gap-2 items-center">
            {isDropdownVisible && (
              <select
                value={selectedDashboard}
                onChange={(e) => {
                  setSelectedDashboard(e.target.value);
                  localStorage.setItem("lastDashboardSelected", e.target.value);
                }}
                className="text-blue-500 font-semibold underline italic py-2"
              >
                <option value="superAdmin">Super Admin Dashboard</option>
                <option value="admin">Admin Dashboard</option>
                <option value="steward">Steward Dashboard</option>
                <option value="volunteer">Volunteer Dashboard</option>
                <option value="beneficiary">Beneficiary Dashboard</option>
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 text-center">
        <h2 className="text-xl font-semibold mt-3 mb-3">{dashboardTitle}</h2>
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
        {/* Render the selected dashboard view component */}
        <div className="requests-section overflow-hidden table-height-fix">
          {selectedDashboard === "superAdmin" && (
            <SuperAdminDashboard
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              headers={headersWithStatus}
              filteredData={filteredData}
              isLoading={isLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onRowsPerPageChange={handleRowsPerPageChange}
              getLinkPath={(request, header) => `/request/${request[header]}`}
              getLinkState={(request) => request}
              searchFilters={
                activeTab === "analytics" ? null : dashboardSearchFilters
              }
              analyticsSubtab={analyticsSubtab}
              setAnalyticsSubtab={setAnalyticsSubtab}
            />
          )}

          {selectedDashboard === "admin" && (
            <AdminDashboard
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              headers={headersWithStatus}
              filteredData={filteredData}
              isLoading={isLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onRowsPerPageChange={handleRowsPerPageChange}
              getLinkPath={(request, header) => `/request/${request[header]}`}
              getLinkState={(request) => request}
              searchFilters={
                activeTab === "analytics" ? null : dashboardSearchFilters
              }
              analyticsSubtab={analyticsSubtab}
              setAnalyticsSubtab={setAnalyticsSubtab}
            />
          )}

          {selectedDashboard === "steward" && (
            <StewardDashboard
              headers={headersWithStatus}
              filteredData={filteredData}
              isLoading={isLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onRowsPerPageChange={handleRowsPerPageChange}
              getLinkPath={(request, header) => `/request/${request[header]}`}
              getLinkState={(request) => request}
              searchFilters={dashboardSearchFilters}
            />
          )}

          {selectedDashboard === "volunteer" && (
            <VolunteerDashboard
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              headers={headersWithStatus}
              filteredData={filteredData}
              isLoading={isLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onRowsPerPageChange={handleRowsPerPageChange}
              getLinkPath={(request, header) => `/request/${request[header]}`}
              getLinkState={(request) => request}
              searchFilters={dashboardSearchFilters}
            />
          )}

          {selectedDashboard === "beneficiary" && (
            <BeneficiaryDashboard
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              headers={headersWithStatus}
              filteredData={filteredData}
              isLoading={isLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onRowsPerPageChange={handleRowsPerPageChange}
              getLinkPath={(request, header) => `/request/${request[header]}`}
              getLinkState={(request) => request}
              searchFilters={dashboardSearchFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
