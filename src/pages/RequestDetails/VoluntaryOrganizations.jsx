import React, { useState, useEffect, useMemo } from "react";
import Table from "../../common/components/DataTable/Table";
import { getVolunteerOrgsList } from "../../services/volunteerServices";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const headers = ["id", "name", "location", "causes", "size", "rating"];
  const [organizations, setOrganizations] = useState([]);
  // const organizations = voluntaryOrganizationsData;

  const getVoluntaryOrganizations = async () => {
    try {
      const response = await getVolunteerOrgsList();
      setOrganizations(response?.body);
    } catch (error) {
      console.error("Error fetching volunteer organizations:", error);
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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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

  //add the filter by category and filter with search input functionality here
  const filteredOrganizations = (organizations) => {
    return organizations.filter(
      (organization) =>
        (Object.keys(categoryFilter).length === 0 ||
          categoryFilter[organization.causes]) &&
        Object.keys(organization).some((key) =>
          String(organization[key])
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        ),
    );
  };

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
      <div className="w-full mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
        >
          <span className="text-2xl mr-2">&lt;</span> Back
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-5">Voluntary Organizations</h1>

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
        getLinkPath={(request, header) => `/organization/${request[header]}`}
      />
    </div>
  );
};

export default VoluntaryOrganizations;
