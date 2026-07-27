import React, { useState, useEffect, useMemo } from "react";
import Table from "../../common/components/DataTable/Table";
import { getOrganizations } from "../../services/mlServices";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingIndicator from "../../common/components/Loading/Loading";
import { createOrganizationDetailsTrail } from "../../common/components/BreadCrumbs/breadcrumbUtils";

const VoluntaryOrganizations = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "rating",
    direction: "descending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const headers = [
    "name",
    "organization_type",
    "collaborator",
    "location",
    "size",
    "rating",
  ];
  const [organizations, setOrganizations] = useState([]);
  const location = useLocation();
  const requestData = location.state || {};
  const breadcrumbTrail = Array.isArray(location.state?.breadcrumbTrail)
    ? location.state.breadcrumbTrail
    : [];
  const requestId =
    requestData?.id ||
    breadcrumbTrail
      .find((item) => item.path?.startsWith("/request/"))
      ?.path?.split("/")
      ?.pop();

  // Get logged-in user's DB id from redux or localStorage (used for My Requests)
  const userDbId =
    useSelector((state) => state.auth.user?.userDbId) ||
    localStorage.getItem("userDbId");

  if (!location.state) {
    console.warn("No requestData passed through navigation");
  }

  const getVoluntaryOrganizations = async () => {
    try {
      setIsLoading(true);
      const personalInfo = JSON.parse(
        localStorage.getItem("personalInfo") || "{}",
      );

      // request_id comes from the request row the user clicked
      const request_id = requestData?.id || "";

      // beneficiary_id:
      // - All Requests: use userId from the request row (the person who made the request)
      // - My Requests: use logged-in user's userDbId
      const beneficiary_id =
        requestData?.requesterId ||
        requestData?.userId ||
        requestData?.beneficiary_id ||
        userDbId ||
        "";

      const payload = {
        request_id,
        beneficiary_id,
      };

      console.log("Org API payload:", payload);

      const response = await getOrganizations(payload);

      const organizationsArray =
        response?.body || response?.data || response || [];

      // Sort: Collaborators first
      const sortedArray = [...organizationsArray].sort((a, b) => {
        if (a.Collaborator && !b.Collaborator) return -1;
        if (!a.Collaborator && b.Collaborator) return 1;
        return 0;
      });

      const formattedOrganizations = sortedArray.map((org, index) => ({
        id: index + 1,
        name: org.Name || org.name || "N/A",
        organization_type: org["Org-type"] || org.organization_type || "N/A",
        collaborator: org.Collaborator ? (
          <span className="text-green-600 text-lg">✓</span>
        ) : (
          ""
        ),
        location: org.location || org.Location || "N/A",
        size: org.size || org.Size || "N/A",
        rating: org.rating || org.Rating || "N/A",
        _rawData: org,
      }));

      setOrganizations(formattedOrganizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVoluntaryOrganizations();
  }, []);

  const sortedOrganizations = (organizations) => {
    if (!organizations || organizations.length === 0) {
      return [];
    }
    let sortableOrganizations = [...organizations];
    if (sortConfig !== null) {
      sortableOrganizations.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "collaborator") {
          valA = React.isValidElement(valA) ? "Yes" : valA;
          valB = React.isValidElement(valB) ? "Yes" : valB;
        }

        if (valA < valB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrganizations;
  };

  const sortedData = useMemo(() => {
    return sortedOrganizations(organizations || []);
  }, [organizations, sortConfig]);

  const filteredOrganizations = (organizations) =>
    organizations.filter((org) =>
      Object.values(org).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );

  const filteredData = useMemo(() => {
    return filteredOrganizations(sortedData);
  }, [sortedData, categoryFilter, searchTerm]);

  const totalPages = (filteredData) => {
    if (!filteredData || filteredData.length == 0) return 1;
    return Math.ceil(filteredData.length / rowsPerPage);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter((prev) => {
      const newFilter = { ...prev };
      if (category === "All") {
        return Object.keys(newFilter).length ===
          Object.keys(allCategories).length
          ? {}
          : allCategories;
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

  const allCategories = {
    All: true,
    Community: true,
    Banking: true,
    Books: true,
    Clothes: true,
    "College Admissions": true,
    Cooking: true,
    Education: true,
    Employment: true,
    Finance: true,
    Food: true,
    Gardening: true,
    Homelessness: true,
    Housing: true,
    Jobs: true,
    Investing: true,
    Matrimonial: true,
    Medical: true,
    Rental: true,
    School: true,
    Shopping: true,
    Sports: true,
    Stocks: true,
    Travel: true,
    Tourism: true,
  };

  useEffect(() => {
    if (Object.keys(categoryFilter).length === 0) {
      setCategoryFilter(allCategories);
    }
  }, []);

  const handleFilterBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget))
      setIsCategoryDropdownOpen(false);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Organizations</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded flex-grow"
        />
        <div className="relative" onBlur={handleFilterBlur} tabIndex={-1}>
          <button
            className="bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300"
            onClick={toggleCategoryDropdown}
            tabIndex={0}
          >
            {t("FILTER_BY")}
          </button>
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <LoadingIndicator size="80px" position="center" />
          <p className="mt-4 text-gray-600 font-medium">
            Fetching best organizations for you...
          </p>
        </div>
      ) : organizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
          <p className="text-lg font-medium">No organizations found</p>
          <p className="text-sm mt-1">
            No matching organizations for this request.
          </p>
        </div>
      ) : (
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
          getLinkPath={(row, header) => {
            if (header !== "name") return null;
            return `/organization/${row.id}`;
          }}
          getLinkState={(row) => ({
            organizationData: row._rawData,
            breadcrumbTrail: createOrganizationDetailsTrail({
              organizationName: row.name,
              requestId,
              requestData,
              requestLabel: t("REQUEST_DETAILS"),
              organizationsLabel: t("ORGANIZATIONS"),
            }),
          })}
        />
      )}
    </div>
  );
};

export default VoluntaryOrganizations;
