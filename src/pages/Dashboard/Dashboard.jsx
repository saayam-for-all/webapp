import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./views/AdminDashboard";
import BeneficiaryDashboard from "./views/BeneficiaryDashboard";
import StewardDashboard from "./views/StewardDashboard";
import SuperAdminDashboard from "./views/SuperAdminDashboard";
import VolunteerDashboard from "./views/VolunteerDashboard";

import {
  getAccessibleDashboards,
  getDefaultDashboard,
  canAccessDashboard,
  validateDashboardAccess,
  getDashboardDisplayName,
  DASHBOARDS,
} from "../../utils/rbac";

import {
  getManagedRequests,
  getMyRequests,
  getOthersRequests,
} from "../../services/requestServices";
import {
  getStatusOptions,
  getPriorityOptions,
  getTypeOptions,
  getCategoryOptions,
  flattenCategories,
  normalizeTypeValue,
  normalizeStatusValue,
  normalizePriorityValue,
} from "../../utils/filterHelpers";
import "./Dashboard.css";

const Dashboard = ({ userRole }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [successMessage, setSuccessMessage] = useState("");
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location.state?.successMessage]);

  const [activeTab, setActiveTab] = useState("myRequests");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "updatedDate",
    direction: "descending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState({
    CREATED: true,
    MATCHING_VOLUNTEER: true,
    MANAGED: true,
  });
  const [categoryFilter, setCategoryFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [data, setData] = useState({});
  const groups = useSelector((state) => state.auth.user?.groups);
  const isLoading = false;
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [accessibleDashboards, setAccessibleDashboards] = useState([]);
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

  const dashboardTables = useMemo(
    () => ({
      [DASHBOARDS.SUPER_ADMIN]: {
        headers: ["id", "metric", "value"],
        rows: [
          { id: "S1", metric: "Total Users", value: "1,200" },
          { id: "S2", metric: "Open Requests", value: 35 },
          { id: "S3", metric: "Volunteers", value: 210 },
        ],
      },
      [DASHBOARDS.ADMIN]: {
        headers: ["id", "team", "activeTasks"],
        rows: [
          { id: "A1", team: "Support", activeTasks: 12 },
          { id: "A2", team: "Operations", activeTasks: 8 },
        ],
      },
      [DASHBOARDS.STEWARD]: {
        headers: ["id", "area", "assigned"],
        rows: [
          { id: "ST1", area: "North Zone", assigned: 5 },
          { id: "ST2", area: "East Zone", assigned: 3 },
        ],
      },
      [DASHBOARDS.VOLUNTEER]: {
        headers: ["id", "name", "hoursLogged"],
        rows: [
          { id: "V1", name: "Priya", hoursLogged: 24 },
          { id: "V2", name: "Arjun", hoursLogged: 18 },
        ],
      },
      [DASHBOARDS.BENEFICIARY]: {
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
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    toggleDropdown();
  }, []);

  useEffect(() => {
    if (!groups || groups.length === 0) {
      setAccessibleDashboards([DASHBOARDS.BENEFICIARY]);
      setSelectedDashboard(DASHBOARDS.BENEFICIARY);
      return;
    }

    const accessible = getAccessibleDashboards(groups);
    setAccessibleDashboards(accessible);

    const urlDashboard = searchParams.get("view");
    if (urlDashboard && accessible.includes(urlDashboard)) {
      setSelectedDashboard(urlDashboard);
      localStorage.setItem("lastDashboardSelected", urlDashboard);
      return;
    }

    const storedDashboard = localStorage.getItem("lastDashboardSelected");
    if (storedDashboard && accessible.includes(storedDashboard)) {
      setSelectedDashboard(storedDashboard);
      return;
    }

    const defaultDash = getDefaultDashboard(groups);
    setSelectedDashboard(defaultDash);
    localStorage.setItem("lastDashboardSelected", defaultDash);
  }, [groups, searchParams]);

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
      CREATED: true,
      MATCHING_VOLUNTEER: true,
      MANAGED: true,
    });
    setCategoryFilter(allCategories);
  };

  const handleDashboardChange = (newDashboard) => {
    const validation = validateDashboardAccess(groups, newDashboard);

    if (!validation.allowed) {
      setAccessDeniedMessage(validation.reason);
      setTimeout(() => setAccessDeniedMessage(""), 5000);
      return;
    }

    setSelectedDashboard(newDashboard);
    localStorage.setItem("lastDashboardSelected", newDashboard);
    setSearchParams({ view: newDashboard });
    setAccessDeniedMessage("");
  };

  const dataKeyMap = {
    requestId: "id",
    beneficiaryId: "userId",
  };
  const resolveKey = (header) => dataKeyMap[header] || header;

  const headersWithStatus = useMemo(() => {
    const baseHeaders = [
      "requestId",
      "subject",
      "updatedDate",
      "creationDate",
      "type",
      "category",
      "priority",
      "calamity",
    ];
    const headersWithUserId =
      activeTab === "othersRequests"
        ? [
            "requestId",
            "beneficiaryId",
            "subject",
            "updatedDate",
            "creationDate",
            "type",
            "category",
            "priority",
            "calamity",
          ]
        : baseHeaders;
    const isAllSelected = Object.values(statusFilter).every(Boolean);
    return isAllSelected ? ["status", ...headersWithUserId] : headersWithUserId;
  }, [statusFilter, activeTab]);

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

  const statusOptions = useMemo(() => {
    // Get status options from Enums API (with translations)
    const enumStatuses = getStatusOptions(t);

    // Also get statuses from current data for backward compatibility
    const dataStatuses = [
      ...new Set((data?.body || []).map((r) => r.status).filter(Boolean)),
    ];

    // Combine enum statuses with any additional statuses from data
    const statusMap = new Map();
    enumStatuses.forEach((status) => {
      statusMap.set(status.key, status);
    });

    // Add any data statuses not in enums
    dataStatuses.forEach((status) => {
      const normalized = normalizeStatusValue(status);
      if (!statusMap.has(normalized)) {
        statusMap.set(normalized, {
          key: normalized,
          value: status,
          label: status,
        });
      }
    });

    return Array.from(statusMap.values());
  }, [data, t]);

  const categoryOptions = useMemo(() => {
    // Get categories from Categories API (with translations)
    const apiCategories = getCategoryOptions(t);

    if (apiCategories.length > 0) {
      // Flatten categories to include subcategories
      return flattenCategories(apiCategories, t);
    }

    // Fallback to hardcoded categories if API data not available
    const backendValues = new Set(
      (data?.body || []).map((r) => r.category).filter(Boolean),
    );
    const defaultValues = Object.keys(allCategories).filter((c) => c !== "All");
    const combined = Array.from(new Set([...defaultValues, ...backendValues]));
    return combined
      .sort()
      .map((cat) => ({ id: cat, name: cat, label: cat, depth: 0 }));
  }, [data, t]);

  const typeOptions = useMemo(() => {
    // Get type options from Enums API (with translations)
    return getTypeOptions(t);
  }, [t]);

  const priorityOptions = useMemo(() => {
    // Get priority options from Enums API (with translations)
    return getPriorityOptions(t);
  }, [t]);

  const calamityOptions = useMemo(() => {
    const values = [
      ...new Set((data?.body || []).map((r) => r.calamity).filter(Boolean)),
    ];
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
      // Normalize values for comparison with enum keys
      const statusNormalized = normalizeStatusValue(request.status);
      const statusActive =
        Object.keys(statusFilter).length === 0 ||
        Object.values(statusFilter).every((v) => !v) ||
        statusFilter[statusNormalized] ||
        statusFilter[request.status]; // Fallback for non-normalized

      const categoryActive =
        Object.keys(categoryFilter).length === 0 ||
        Object.values(categoryFilter).every((v) => !v) ||
        categoryFilter[request.category];

      const typeNormalized = normalizeTypeValue(request.type);
      const typeActive =
        Object.keys(typeFilter).length === 0 ||
        Object.values(typeFilter).every((v) => !v) ||
        (typeNormalized && typeFilter[typeNormalized]);

      const priorityNormalized = normalizePriorityValue(request.priority);
      const priorityActive =
        Object.keys(priorityFilter).length === 0 ||
        Object.values(priorityFilter).every((v) => !v) ||
        priorityFilter[priorityNormalized] ||
        priorityFilter[request.priority]; // Fallback for non-normalized

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

      const volunteerTypeActive =
        selectedDashboard !== DASHBOARDS.VOLUNTEER ||
        activeTab !== "managedRequests" ||
        Object.keys(volunteerTypeFilter).length === 0 ||
        Object.values(volunteerTypeFilter).every((v) => !v) ||
        Object.values(volunteerTypeFilter).every(Boolean) ||
        volunteerTypeFilter[request.volunteerType];

      const matchesSearch = Object.keys(request).some((key) =>
        String(request[key]).toLowerCase().includes(searchTerm.toLowerCase()),
      );

      return (
        statusActive &&
        categoryActive &&
        typeActive &&
        priorityActive &&
        calamityActive &&
        volunteerTypeActive &&
        matchesSearch
      );
    });
  };

  const [typeFilter, setTypeFilter] = useState({
    IN_PERSON: true,
    REMOTE: true,
  });

  const [priorityFilter, setPriorityFilter] = useState({});
  const [calamityFilter, setCalamityFilter] = useState({});
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isCalamityDropdownOpen, setIsCalamityDropdownOpen] = useState(false);

  const [volunteerTypeFilter, setVolunteerTypeFilter] = useState({
    "Lead Volunteer": true,
    "Helping Volunteer": true,
  });
  const [isVolunteerTypeDropdownOpen, setIsVolunteerTypeDropdownOpen] =
    useState(false);

  const toggleVolunteerTypeDropdown = () =>
    setIsVolunteerTypeDropdownOpen(!isVolunteerTypeDropdownOpen);

  const handleVolunteerTypeBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget))
      setIsVolunteerTypeDropdownOpen(false);
  };

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
    volunteerTypeFilter,
    selectedDashboard,
    activeTab,
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
    const resolved = resolveKey(key);
    let direction = "ascending";
    if (sortConfig.key === resolved && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: resolved, direction });
  };

  const handleStatusChange = (statusKey) => {
    if (statusKey === "All") {
      const allSelected = !Object.values(statusFilter).every(Boolean);
      const updatedFilter = {};
      statusOptions.forEach((s) => {
        updatedFilter[s.key] = allSelected;
      });
      setStatusFilter(updatedFilter);
    } else {
      setStatusFilter((prev) => ({
        ...prev,
        [statusKey]: !prev[statusKey],
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

  const dashboardTitle = selectedDashboard
    ? getDashboardDisplayName(selectedDashboard)
    : "Dashboard";

  const dashboardDefaultTab = {
    [DASHBOARDS.SUPER_ADMIN]: "analytics",
    [DASHBOARDS.ADMIN]: "analytics",
    [DASHBOARDS.STEWARD]: "myRequests",
    [DASHBOARDS.VOLUNTEER]: "managedRequests",
    [DASHBOARDS.BENEFICIARY]: "myRequests",
  };

  useEffect(() => {
    if (selectedDashboard && dashboardDefaultTab[selectedDashboard]) {
      setActiveTab(dashboardDefaultTab[selectedDashboard]);
    }
  }, [selectedDashboard]);

  const dashboardSearchFilters = (
    <>
      <div className="mb-4 flex flex-wrap gap-2 px-10">
        <div className="relative w-full">
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
        <div className="relative" onBlur={handleFilterBlur} tabIndex={-1}>
          <div
            className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
            onClick={toggleCategoryDropdown}
            tabIndex={0}
          >
            <button className="py-2 px-4 p-2 font-light text-gray-600">
              {t("FILTER_BY")}
              {Object.keys(categoryFilter).length > 0 &&
                Object.keys(categoryFilter).length !==
                  categoryOptions.length && (
                  <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {Object.keys(categoryFilter).length}
                  </span>
                )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isCategoryDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 max-h-96 overflow-y-auto min-w-64">
              <label className="block">
                <input
                  type="checkbox"
                  checked={
                    categoryOptions.length > 0 &&
                    Object.keys(categoryFilter).length ===
                      categoryOptions.length
                  }
                  onChange={() => handleCategoryChange("All")}
                />
                {t("All Categories")}
              </label>
              {categoryOptions.map((category) => (
                <label
                  key={category.id || category.name}
                  className="block"
                  style={{ paddingLeft: `${(category.depth || 0) * 20}px` }}
                >
                  <input
                    type="checkbox"
                    checked={categoryFilter[category.name] || false}
                    onChange={() => handleCategoryChange(category.name)}
                  />
                  {category.depth > 0 && <span className="mr-1">↳</span>}
                  {category.label}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="relative" onBlur={handleStatusBlur} tabIndex={-1}>
          <div
            className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
            onClick={toggleStatusDropdown}
            tabIndex={0}
          >
            <button className="py-2 px-4 p-2 font-light text-gray-600">
              {t("Status")}
              {Object.values(statusFilter).filter(Boolean).length > 0 &&
                !Object.values(statusFilter).every(Boolean) && (
                  <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {Object.values(statusFilter).filter(Boolean).length}
                  </span>
                )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isStatusDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
              <label className="block">
                <input
                  type="checkbox"
                  checked={Object.values(statusFilter).every(Boolean)}
                  onChange={() => handleStatusChange("All")}
                />
                {t("All")}
              </label>
              {statusOptions.map((status) => (
                <label key={status.key} className="block">
                  <input
                    type="checkbox"
                    checked={statusFilter[status.key] || false}
                    onChange={() => handleStatusChange(status.key)}
                  />
                  {status.label}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="relative" onBlur={handleTypeBlur} tabIndex={-1}>
          <div
            className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
            onClick={toggleTypeDropdown}
            tabIndex={0}
          >
            <button className="py-2 px-4 p-2 font-light text-gray-600">
              {t("Type")}
              {Object.values(typeFilter).filter(Boolean).length > 0 &&
                Object.values(typeFilter).filter(Boolean).length !==
                  typeOptions.length && (
                  <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {Object.values(typeFilter).filter(Boolean).length}
                  </span>
                )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isTypeDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
              {typeOptions.map((type) => (
                <label key={type.key} className="block">
                  <input
                    type="checkbox"
                    checked={typeFilter[type.key] || false}
                    onChange={() =>
                      setTypeFilter((prev) => ({
                        ...prev,
                        [type.key]: !prev[type.key],
                      }))
                    }
                  />
                  {type.label}
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
              {t("Priority")}
              {Object.values(priorityFilter).filter(Boolean).length > 0 &&
                Object.values(priorityFilter).filter(Boolean).length !==
                  priorityOptions.length && (
                  <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {Object.values(priorityFilter).filter(Boolean).length}
                  </span>
                )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isPriorityDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
              {priorityOptions.map((priority) => (
                <label key={priority.key} className="block">
                  <input
                    type="checkbox"
                    checked={priorityFilter[priority.key] || false}
                    onChange={() =>
                      setPriorityFilter((prev) => ({
                        ...prev,
                        [priority.key]: !prev[priority.key],
                      }))
                    }
                  />
                  {priority.label}
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
              {t("Calamity")}
              {Object.values(calamityFilter).filter(Boolean).length > 0 &&
                Object.values(calamityFilter).filter(Boolean).length !==
                  calamityOptions.length && (
                  <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {Object.values(calamityFilter).filter(Boolean).length}
                  </span>
                )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isCalamityDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
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

        {selectedDashboard === DASHBOARDS.VOLUNTEER &&
          activeTab === "managedRequests" && (
            <div
              className="relative"
              onBlur={handleVolunteerTypeBlur}
              tabIndex={-1}
            >
              <div
                className="bg-blue-50 flex items-center rounded-md hover:bg-gray-300"
                onClick={toggleVolunteerTypeDropdown}
              >
                <button className="py-2 px-4 p-2 font-light text-gray-600">
                  {t("Volunteer Type")}
                  {Object.values(volunteerTypeFilter).filter(Boolean).length >
                    0 &&
                    !Object.values(volunteerTypeFilter).every(Boolean) && (
                      <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                        {
                          Object.values(volunteerTypeFilter).filter(Boolean)
                            .length
                        }
                      </span>
                    )}
                </button>
                <IoIosArrowDown className="m-2" />
              </div>
              {isVolunteerTypeDropdownOpen && (
                <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
                  <label className="block">
                    <input
                      type="checkbox"
                      checked={volunteerTypeFilter["Lead Volunteer"] || false}
                      onChange={() =>
                        setVolunteerTypeFilter((prev) => ({
                          ...prev,
                          "Lead Volunteer": !prev["Lead Volunteer"],
                        }))
                      }
                    />
                    Lead Volunteer
                  </label>
                  <label className="block">
                    <input
                      type="checkbox"
                      checked={
                        volunteerTypeFilter["Helping Volunteer"] || false
                      }
                      onChange={() =>
                        setVolunteerTypeFilter((prev) => ({
                          ...prev,
                          "Helping Volunteer": !prev["Helping Volunteer"],
                        }))
                      }
                    />
                    Helping Volunteer
                  </label>
                </div>
              )}
            </div>
          )}
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
            selectedDashboard !== DASHBOARDS.VOLUNTEER && (
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
            {isDropdownVisible && accessibleDashboards.length > 0 && (
              <select
                value={selectedDashboard}
                onChange={(e) => handleDashboardChange(e.target.value)}
                className="text-blue-500 font-semibold underline italic py-2"
              >
                {accessibleDashboards.map((dash) => (
                  <option key={dash} value={dash}>
                    {getDashboardDisplayName(dash)}
                  </option>
                ))}
              </select>
            )}
          </div>
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

      {accessDeniedMessage && (
        <div className="relative bg-red-100 text-red-700 p-3 mb-5 rounded-md text-center font-semibold">
          {accessDeniedMessage}
          <button
            onClick={() => setAccessDeniedMessage("")}
            className="absolute top-2 right-4 text-red-700 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex-1 text-center">
        <h2 className="text-xl font-semibold mt-3 mb-3">{dashboardTitle}</h2>
      </div>

      <div className="border">
        {selectedDashboard && canAccessDashboard(groups, selectedDashboard) ? (
          <div className="requests-section overflow-hidden table-height-fix">
            {selectedDashboard === DASHBOARDS.SUPER_ADMIN && (
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
                getLinkPath={(request, header) =>
                  `/request/${request[resolveKey(header)]}`
                }
                getLinkState={(request) => request}
                searchFilters={
                  activeTab === "analytics" ? null : dashboardSearchFilters
                }
                analyticsSubtab={analyticsSubtab}
                setAnalyticsSubtab={setAnalyticsSubtab}
              />
            )}

            {selectedDashboard === DASHBOARDS.ADMIN && (
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
                getLinkPath={(request, header) =>
                  `/request/${request[resolveKey(header)]}`
                }
                getLinkState={(request) => request}
                searchFilters={
                  activeTab === "analytics" ? null : dashboardSearchFilters
                }
                analyticsSubtab={analyticsSubtab}
                setAnalyticsSubtab={setAnalyticsSubtab}
              />
            )}

            {selectedDashboard === DASHBOARDS.STEWARD && (
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
                getLinkPath={(request, header) =>
                  `/request/${request[resolveKey(header)]}`
                }
                getLinkState={(request) => request}
                searchFilters={dashboardSearchFilters}
              />
            )}

            {selectedDashboard === DASHBOARDS.VOLUNTEER && (
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
                getLinkPath={(request, header) =>
                  `/request/${request[resolveKey(header)]}`
                }
                getLinkState={(request) => request}
                searchFilters={dashboardSearchFilters}
              />
            )}

            {selectedDashboard === DASHBOARDS.BENEFICIARY && (
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
                getLinkPath={(request, header) =>
                  `/request/${request[resolveKey(header)]}`
                }
                getLinkState={(request) => request}
                searchFilters={dashboardSearchFilters}
              />
            )}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-600">
            <p className="text-lg font-semibold mb-2">Access Denied</p>
            <p>You don&apos;t have permission to view this dashboard.</p>
            <p className="mt-4 text-sm">Please contact your admin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
