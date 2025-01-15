import React, { useState, useEffect } from "react";
import Table from "../../common/components/DataTable/Table";
import { voluntaryOrganizationsData } from "./dummyData";

const VoluntaryOrganizations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "rating",
    direction: "descending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const headers = ["id", "name", "location", "causes", "size", "rating"];

  const sortedOrganizations = (organizations) => {
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

  //add the filter by category and filter with search input functionality here
  const filteredOrganizations = (organizations) => {
    return sortedOrganizations(organizations).filter(
      (organization) =>
        (Object.keys(categoryFilter).length === 0 ||
          categoryFilter[organization.causes]) &&
        Object.keys(organization).some((key) =>
          String(organization[key])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
    );
  };

  const totalPages = (organizations) => {
    return Math.ceil(filteredOrganizations(organizations).length / rowsPerPage);
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
        return Object.keys(newFilter).length === allCategories.length ? {} : allCategories;
      } else {
        if (newFilter[category]) {
          delete newFilter[category];
        } else {
          newFilter[category] = true;
        }
        return newFilter;
      }
    });
  };

  
  const allCategories = {
    "Banking": true,
    "Books": true,
    "Clothes": true,
    "College Admissions": true,
    "Cooking": true,
    "Education": true,
    "Employment": true,
    "Finance": true,
    "Food": true,
    "Gardening": true,
    "Homelessness": true,
    "Housing": true,
    "Jobs": true,
    "Investing": true,
    "Matrimonial": true,
    "Medical": true,
    "Rental": true,
    "School": true,
    "Shopping": true,
    "Sports": true,
    "Stocks": true,
    "Travel": true,
    "Tourism": true
  };
  

  useEffect(() => {
    if (Object.keys(categoryFilter).length === 0) {
      setCategoryFilter(allCategories);
    }
  }, []);


  const organizations = voluntaryOrganizationsData;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Voluntary Organizations</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded flex-grow"
        />
        <div className="relative">
          <button
            className="bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300"
            onClick={toggleCategoryDropdown}
          >
            Filter by Category
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
              {Object.keys(allCategories).map((category) => (
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
        rows={filteredOrganizations(organizations)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages(organizations)}
        totalRows={filteredOrganizations(organizations).length}
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


