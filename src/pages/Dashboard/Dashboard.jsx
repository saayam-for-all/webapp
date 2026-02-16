import { useEffect, useMemo, useState } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
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
import { MdOutlineContactPhone } from "react-icons/md";

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
  getCategoriesFromStorage,
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
  const [statusFilter, setStatusFilter] = useState({});
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "analytics") setAnalyticsSubtab("Infrastructure");
    setCurrentPage(1);
    setStatusFilter({});
    // DON'T reset category filter when changing tabs
    // This was causing issues where API categories didn't match data categories
    // Keep the existing filter state or leave it empty to show all data
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

    // Deduplicate enum statuses by key to prevent duplicates
    const statusMap = new Map();
    enumStatuses.forEach((status) => {
      if (!statusMap.has(status.key)) {
        statusMap.set(status.key, status);
      }
    });

    // Also get statuses from current data for backward compatibility
    const dataStatuses = [
      ...new Set((data?.body || []).map((r) => r.status).filter(Boolean)),
    ];

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
    // Get categories from Categories API with hierarchical structure
    const categories = getCategoriesFromStorage();

    // Get all category names from actual data
    const dataCategoryNames = new Set(
      (data?.body || []).map((r) => r.category).filter(Boolean),
    );

    if (categories && Array.isArray(categories) && dataCategoryNames.size > 0) {
      // Check if API categories match the data categories
      const getAllCategoryNames = (cats) => {
        const names = [];
        cats.forEach((cat) => {
          names.push(cat.catName);
          if (cat.subCategories && cat.subCategories.length > 0) {
            names.push(...getAllCategoryNames(cat.subCategories));
          }
        });
        return names;
      };

      const apiCategoryNames = getAllCategoryNames(categories);
      const matchCount = apiCategoryNames.filter((apiCat) =>
        dataCategoryNames.has(apiCat),
      ).length;

      // Only use API categories if at least 50% match the data
      // This ensures we use API categories for real data, but fall back for mock data
      if (
        matchCount >=
        Math.min(dataCategoryNames.size, apiCategoryNames.length) * 0.5
      ) {
        const transformCategories = (cats) => {
          return cats.map((cat) => ({
            category: cat.catName,
            label: t(
              `categories:REQUEST_CATEGORIES.${cat.catId}.LABEL`,
              cat.catName,
            ),
            subCategories:
              cat.subCategories && cat.subCategories.length > 0
                ? transformCategories(cat.subCategories)
                : undefined,
          }));
        };

        return transformCategories(categories);
      }

      // API categories don't match data - use data categories instead
      console.warn(
        "API categories don't match data categories (matched " +
          matchCount +
          " out of " +
          dataCategoryNames.size +
          "), using data categories instead",
      );
    }

    // Fallback: use categories from actual data
    const backendValues = new Set(
      (data?.body || []).map((r) => r.category).filter(Boolean),
    );
    const combined = Array.from(backendValues);
    return combined.sort().map((cat) => ({
      category: cat,
      label: cat,
    }));
  }, [data, t]);

  const typeOptions = useMemo(() => {
    // Get type options from Enums API (with translations)
    return getTypeOptions(t);
  }, [t]);

  const priorityOptions = useMemo(() => {
    // Get priority options from Enums API (with translations)
    return getPriorityOptions(t);
  }, [t]);

  const calamityOptions = [
    { key: "All", value: "All", label: "All" },
    { key: "Yes", value: "Yes", label: "Yes" },
    { key: "No", value: "No", label: "No" },
  ];

  // Helper function to get checked status for hierarchical categories
  const getCategoryCheckedStatus = (categoryPath, filterState) => {
    const keys = categoryPath.split(".");
    let currentLevel = filterState || categoryFilter || {};

    for (let key of keys) {
      if (!currentLevel[key]) return false;
      currentLevel = currentLevel[key];
    }

    return currentLevel.checked === true;
  };

  // Helper function to get all selected category names (including children of selected parents)
  const getSelectedCategoryNames = () => {
    const selectedNames = [];

    const collectNames = (cats, parentPath = "", parentSelected = false) => {
      cats.forEach((cat) => {
        const categoryName = typeof cat === "object" ? cat.category : cat;
        const currentPath = parentPath
          ? `${parentPath}.${categoryName}`
          : categoryName;
        const isSelected = getCategoryCheckedStatus(
          currentPath,
          categoryFilter,
        );

        // If this category is selected OR its parent is selected, include it
        if (isSelected || parentSelected) {
          selectedNames.push(categoryName);

          // If parent is selected, include all children
          if (cat.subCategories) {
            collectNames(cat.subCategories, currentPath, true);
          }
        } else if (cat.subCategories) {
          // Parent not selected, but check children
          collectNames(cat.subCategories, currentPath, false);
        }
      });
    };

    // Guard check to ensure categoryOptions exists before using it
    if (categoryOptions && categoryOptions.length > 0) {
      collectNames(categoryOptions);
    }
    return selectedNames;
  };

  const filteredRequests = (requests) => {
    return requests.filter((request) => {
      // Normalize values for comparison with enum keys
      const statusNormalized = normalizeStatusValue(request.status);
      const statusActive =
        Object.keys(statusFilter).length === 0 ||
        Object.values(statusFilter).every((v) => v === false) ||
        statusFilter[statusNormalized];
      // Fallback for non-normalized

      // Check if request category matches any selected category
      const categoryMatches = () => {
        if (Object.keys(categoryFilter).length === 0) return true;

        const requestCategory = request.category;
        if (!requestCategory) return false;

        // Get all selected category names (including children of selected parents)
        const selectedCategoryNames = getSelectedCategoryNames();

        // Check if request category is in the selected list
        return selectedCategoryNames.includes(requestCategory);
      };

      const categoryActive = categoryMatches();

      const typeNormalized = normalizeTypeValue(request.type);
      const typeActive =
        Object.keys(typeFilter).length === 0 ||
        Object.values(typeFilter).every((v) => v === false) ||
        typeFilter["All"] ||
        typeFilter[typeNormalized];

      const priorityNormalized = normalizePriorityValue(request.priority);
      const priorityActive =
        Object.keys(priorityFilter).length === 0 ||
        Object.values(priorityFilter).every((v) => v === false) ||
        priorityFilter["All"] ||
        priorityFilter[priorityNormalized];

      const calamityValue =
        request.calamity === true ||
        request.calamity === "Yes" ||
        request.calamity === "yes"
          ? "Yes"
          : "No";

      const calamityActive =
        Object.keys(calamityFilter).length === 0 ||
        Object.values(calamityFilter).every((v) => v === false) ||
        calamityFilter["All"] ||
        calamityFilter[calamityValue];

      const volunteerTypeActive =
        selectedDashboard !== DASHBOARDS.VOLUNTEER ||
        activeTab !== "managedRequests" ||
        Object.keys(volunteerTypeFilter).length === 0 ||
        Object.values(volunteerTypeFilter).every((v) => v === false) ||
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

  const [typeFilter, setTypeFilter] = useState({});
  const handleTypeChange = (value) => {
    if (value === "All") {
      const allSelected =
        typeOptions.length > 0 &&
        typeOptions
          .filter((t) => t.value !== "All")
          .every((t) => typeFilter[t.value]);

      if (!allSelected) {
        const updated = {};
        typeOptions.forEach((t) => {
          updated[t.value] = true;
        });
        setTypeFilter(updated);
      } else {
        setTypeFilter({});
      }
    } else {
      setTypeFilter((prev) => {
        const updated = {
          ...prev,
          [value]: !prev[value],
        };

        const nonAllValues = typeOptions
          .filter((t) => t.value !== "All")
          .map((t) => t.value);

        const allSelected = nonAllValues.every((v) => updated[v]);

        updated["All"] = allSelected;

        return updated;
      });
    }
  };

  const [priorityFilter, setPriorityFilter] = useState({});

  const handlePriorityChange = (value) => {
    if (value === "All") {
      const allSelected =
        priorityOptions.length > 0 &&
        priorityOptions
          .filter((p) => p.value !== "All")
          .every((p) => priorityFilter[p.value]);

      if (!allSelected) {
        const updated = {};
        priorityOptions.forEach((p) => {
          updated[p.value] = true;
        });
        setPriorityFilter(updated);
      } else {
        setPriorityFilter({});
      }
    } else {
      setPriorityFilter((prev) => {
        const updated = {
          ...prev,
          [value]: !prev[value],
        };

        const nonAllValues = priorityOptions
          .filter((p) => p.value !== "All")
          .map((p) => p.value);

        const allSelected = nonAllValues.every((v) => updated[v]);

        updated["All"] = allSelected;

        return updated;
      });
    }
  };

  const [calamityFilter, setCalamityFilter] = useState({});

  const handleCalamityChange = (value) => {
    if (value === "All") {
      const allSelected =
        calamityOptions.length > 0 &&
        calamityOptions
          .filter((c) => c.value !== "All")
          .every((c) => calamityFilter[c.value]);

      if (!allSelected) {
        const updated = {};
        calamityOptions.forEach((c) => {
          updated[c.value] = true;
        });
        setCalamityFilter(updated);
      } else {
        setCalamityFilter({});
      }
    } else {
      setCalamityFilter((prev) => {
        const updated = {
          ...prev,
          [value]: !prev[value],
        };

        const nonAllValues = calamityOptions
          .filter((c) => c.value !== "All")
          .map((c) => c.value);

        const allSelected = nonAllValues.every((v) => updated[v]);

        updated["All"] = allSelected;

        return updated;
      });
    }
  };

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isCalamityDropdownOpen, setIsCalamityDropdownOpen] = useState(false);

  const [volunteerTypeFilter, setVolunteerTypeFilter] = useState({});
  const [isVolunteerTypeDropdownOpen, setIsVolunteerTypeDropdownOpen] =
    useState(false);

  // Generic dropdown toggle handler (eliminates code duplication)
  const createToggleHandler = (setter, currentValue) => () =>
    setter(!currentValue);

  // Generic blur handler for closing dropdowns (eliminates code duplication)
  const createBlurHandler = (setter) => (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setter(false);
  };

  const toggleVolunteerTypeDropdown = createToggleHandler(
    setIsVolunteerTypeDropdownOpen,
    isVolunteerTypeDropdownOpen,
  );
  const toggleTypeDropdown = createToggleHandler(
    setIsTypeDropdownOpen,
    isTypeDropdownOpen,
  );
  const togglePriorityDropdown = createToggleHandler(
    setIsPriorityDropdownOpen,
    isPriorityDropdownOpen,
  );
  const toggleCalamityDropdown = createToggleHandler(
    setIsCalamityDropdownOpen,
    isCalamityDropdownOpen,
  );
  const toggleCategoryDropdown = createToggleHandler(
    setIsCategoryDropdownOpen,
    isCategoryDropdownOpen,
  );
  const toggleStatusDropdown = createToggleHandler(
    setIsStatusDropdownOpen,
    isStatusDropdownOpen,
  );

  const handleVolunteerTypeBlur = createBlurHandler(
    setIsVolunteerTypeDropdownOpen,
  );
  const handleTypeBlur = createBlurHandler(setIsTypeDropdownOpen);
  const handlePriorityBlur = createBlurHandler(setIsPriorityDropdownOpen);
  const handleCalamityBlur = createBlurHandler(setIsCalamityDropdownOpen);
  const handleFilterBlur = createBlurHandler(setIsCategoryDropdownOpen);
  const handleStatusBlur = createBlurHandler(setIsStatusDropdownOpen);

  // Helper function to get filter badge count (show count when items are selected)
  const getFilterBadgeCount = (filterState, totalOptions) => {
    const selectedCount = Object.values(filterState).filter(Boolean).length;
    // Only show badge if at least one item is selected
    if (selectedCount === 0) {
      return null;
    }
    return selectedCount;
  };

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
    categoryOptions,
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
      // Check if all items are currently selected
      const allCurrentlySelected =
        statusOptions.length > 0 &&
        statusOptions.every((s) => statusFilter[s.key]);

      const updatedFilter = {};
      if (!allCurrentlySelected) {
        // If not all selected, select all
        statusOptions.forEach((s) => {
          updatedFilter[s.key] = true;
        });
      }
      // If all selected, updatedFilter stays empty (deselect all)
      setStatusFilter(updatedFilter);
    } else {
      setStatusFilter((prev) => ({
        ...prev,
        [statusKey]: !prev[statusKey],
      }));
    }
  };

  // Helper function to set checkbox state for hierarchical categories
  const setCategoryCheckboxState = (draft, categoryPath, checked) => {
    const keys = categoryPath.split(".");
    let currentLevel = draft;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        if (checked) {
          currentLevel[key] = { checked: true };
        } else {
          delete currentLevel[key];
        }
      } else {
        if (!currentLevel[key]) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    });
  };

  // Helper function to check if all categories are selected
  const areAllCategoriesSelected = (categories, filterState) => {
    const checkAllSelected = (cats, parentPath = "") => {
      for (const cat of cats) {
        const categoryName = typeof cat === "object" ? cat.category : cat;
        const currentPath = parentPath
          ? `${parentPath}.${categoryName}`
          : categoryName;

        if (!getCategoryCheckedStatus(currentPath, filterState)) {
          return false;
        }

        if (cat.subCategories) {
          if (!checkAllSelected(cat.subCategories, currentPath)) {
            return false;
          }
        }
      }
      return true;
    };

    return checkAllSelected(categories);
  };

  // Helper function to select/deselect all categories
  const setAllCategories = (categories, checked) => {
    const newFilter = {};

    const setAll = (cats, parentPath = "") => {
      cats.forEach((cat) => {
        const categoryName = typeof cat === "object" ? cat.category : cat;
        const currentPath = parentPath
          ? `${parentPath}.${categoryName}`
          : categoryName;

        if (checked) {
          setCategoryCheckboxState(newFilter, currentPath, true);
        }

        if (cat.subCategories) {
          setAll(cat.subCategories, currentPath);
        }
      });
    };

    setAll(categories);
    return checked ? newFilter : {};
  };

  // Helper function to remove all child categories when parent is unchecked
  const removeChildCategories = (filter, categoryPath) => {
    const keys = categoryPath.split(".");
    let currentLevel = filter;

    // Navigate to the parent level
    for (let i = 0; i < keys.length - 1; i++) {
      if (!currentLevel[keys[i]]) return;
      currentLevel = currentLevel[keys[i]];
    }

    // Remove the category and all its children
    const lastKey = keys[keys.length - 1];
    delete currentLevel[lastKey];
  };

  const handleCategoryChange = (categoryPath) => {
    if (categoryPath === "All") {
      const allSelected = areAllCategoriesSelected(
        categoryOptions,
        categoryFilter,
      );
      setCategoryFilter(setAllCategories(categoryOptions, !allSelected));
    } else {
      setCategoryFilter((prev) => {
        const newFilter = JSON.parse(JSON.stringify(prev)); // Deep clone
        const checkedStatus = getCategoryCheckedStatus(categoryPath, prev);

        if (checkedStatus) {
          // Unchecking - remove this category and all its children
          removeChildCategories(newFilter, categoryPath);
        } else {
          // Checking - just set this category to checked
          setCategoryCheckboxState(newFilter, categoryPath, true);
        }

        return newFilter;
      });
    }
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  // Count selected categories (for badge display)
  const getSelectedCategoryCount = () => {
    let count = 0;
    const countSelected = (obj) => {
      for (const key in obj) {
        if (obj[key].checked === true) {
          count++;
        } else if (typeof obj[key] === "object") {
          countSelected(obj[key]);
        }
      }
    };
    countSelected(categoryFilter);
    return count;
  };

  // Recursive function to render cascading categories
  const renderCategories = (categories, parentPath = "") => {
    const sortedCategories = [...categories].sort((a, b) => {
      const aName = typeof a === "object" ? a.category : a;
      const bName = typeof b === "object" ? b.category : b;
      return aName.localeCompare(bName);
    });

    return sortedCategories.map((cat, index) => {
      const isObject = typeof cat === "object";
      const categoryName = isObject ? cat.category : cat;
      const categoryLabel = isObject ? cat.label : cat;
      const hasSubCategories = isObject && cat.subCategories;

      // Create a unique path for each category
      const currentPath = parentPath
        ? `${parentPath}.${categoryName}`
        : categoryName;

      return (
        <div key={index} className={parentPath ? "ml-4" : ""}>
          <label className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={getCategoryCheckedStatus(currentPath, categoryFilter)}
              onChange={() => handleCategoryChange(currentPath)}
              className="cursor-pointer"
            />
            <span
              className={
                getCategoryCheckedStatus(currentPath, categoryFilter)
                  ? "font-semibold"
                  : ""
              }
            >
              {categoryLabel}
            </span>
          </label>

          {/* Recursively render subcategories if they exist and parent is checked */}
          {hasSubCategories &&
            getCategoryCheckedStatus(currentPath, categoryFilter) && (
              <div className="ml-3">
                {renderCategories(cat.subCategories, currentPath)}
              </div>
            )}
        </div>
      );
    });
  };

  const [hasAddress, setHasAddress] = useState(
    localStorage.getItem("addressFlag") === "true",
  );

  useEffect(() => {
    setHasAddress(localStorage.getItem("addressFlag") === "true");
  }, [location]);

  useEffect(() => {
    // DON'T auto-initialize category filter
    // Keep it empty so all data shows by default
    // This avoids issues when API categories don't match data categories
    // Users can manually select categories if they want to filter
    // The commented code below was causing issues where API categories
    // didn't match mock data categories, resulting in no data showing
    /*
    if (
      Object.keys(categoryFilter).length === 0 &&
      categoryOptions.length > 0
    ) {
      // Initialize with all categories selected
      const allCategoriesFilter = setAllCategories(categoryOptions, true);
      setCategoryFilter(allCategoriesFilter);
    }
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryOptions]);

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
            <button className="py-2 px-4 p-2 font-light text-gray-600 flex items-center gap-2">
              {t("FILTER_BY")}
              {getSelectedCategoryCount() > 0 && (
                <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-sm font-semibold">
                  {getSelectedCategoryCount()}
                </span>
              )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isCategoryDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-50 min-w-64 max-h-64 overflow-y-auto">
              <label className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    categoryOptions.length > 0 &&
                    areAllCategoriesSelected(categoryOptions, categoryFilter)
                  }
                  onChange={() => handleCategoryChange("All")}
                  className="cursor-pointer"
                />
                <span className="font-semibold">{t("All Categories")}</span>
              </label>
              <div className="mt-2">
                {categoryOptions.length > 0 &&
                  renderCategories(categoryOptions)}
              </div>
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
              {getFilterBadgeCount(statusFilter, statusOptions.length) && (
                <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {getFilterBadgeCount(statusFilter, statusOptions.length)}
                </span>
              )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isStatusDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
              <label className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    statusOptions.length > 0 &&
                    statusOptions.every((s) => statusFilter[s.key])
                  }
                  onChange={() => handleStatusChange("All")}
                  className="cursor-pointer"
                />
                <span>{t("All")}</span>
              </label>
              {statusOptions.map((status) => (
                <label
                  key={status.key}
                  className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={statusFilter[status.key] || false}
                    onChange={() => handleStatusChange(status.key)}
                    className="cursor-pointer"
                  />
                  <span>{String(status.label).toUpperCase()}</span>
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
              {getFilterBadgeCount(typeFilter, typeOptions.length) && (
                <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {getFilterBadgeCount(typeFilter, typeOptions.length)}
                </span>
              )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isTypeDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
              {typeOptions.map((type) => (
                <label
                  key={type.key}
                  className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={typeFilter[type.value] || false}
                    onChange={() => handleTypeChange(type.value)}
                    className="cursor-pointer"
                  />
                  <span>{type.label}</span>
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
              {getFilterBadgeCount(priorityFilter, priorityOptions.length) && (
                <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {getFilterBadgeCount(priorityFilter, priorityOptions.length)}
                </span>
              )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isPriorityDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
              {priorityOptions.map((priority) => (
                <label
                  key={priority.key}
                  className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={priorityFilter[priority.value] || false}
                    onChange={() => handlePriorityChange(priority.value)}
                    className="cursor-pointer"
                  />
                  <span>{priority.label}</span>
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
              {getFilterBadgeCount(calamityFilter, calamityOptions.length) && (
                <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {getFilterBadgeCount(calamityFilter, calamityOptions.length)}
                </span>
              )}
            </button>
            <IoIosArrowDown className="m-2" />
          </div>
          {isCalamityDropdownOpen && (
            <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
              {calamityOptions.map((cal) => (
                <label
                  key={cal}
                  className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={calamityFilter[cal.value] || false}
                    onChange={() => handleCalamityChange(cal.value)}
                    className="cursor-pointer"
                  />
                  <span>{cal.label}</span>
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
                  {getFilterBadgeCount(volunteerTypeFilter, 2) && (
                    <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {getFilterBadgeCount(volunteerTypeFilter, 2)}
                    </span>
                  )}
                </button>
                <IoIosArrowDown className="m-2" />
              </div>
              {isVolunteerTypeDropdownOpen && (
                <div className="absolute bg-white border mt-1 p-2 rounded shadow-lg z-10 min-w-64">
                  <label className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={volunteerTypeFilter["Lead Volunteer"] || false}
                      onChange={() =>
                        setVolunteerTypeFilter((prev) => ({
                          ...prev,
                          "Lead Volunteer": !prev["Lead Volunteer"],
                        }))
                      }
                      className="cursor-pointer"
                    />
                    <span>Lead Volunteer</span>
                  </label>
                  <label className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
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
                      className="cursor-pointer"
                    />
                    <span>Helping Volunteer</span>
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
          {selectedDashboard === DASHBOARDS.BENEFICIARY && (
            <Link
              to="/emergency-contact"
              className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
              style={{ color: "white", textDecoration: "none" }}
            >
              <MdOutlineContactPhone size={20} />
              <span className="hover:underline">{t("EMERGENCY_CONTACT")}</span>
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
