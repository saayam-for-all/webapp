import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../common/components/DataTable/Table";
import { requestsData } from "./data";

const Dashboard = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState("myRequests");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "creationDate", direction: "ascending" });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState({ Open: true, Closed: false });
  const [categoryFilter, setCategoryFilter] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const headers = ["id", "type", "subject", "creationDate", "closedDate", "status", "category", "priority", "calamity"];

  let navigate = useNavigate();

  const newVolunteer = () => {
    navigate('/newVolunteer');
  }

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
    return sortedRequests(requests).filter(request => (
      (Object.keys(statusFilter).length === 0 || statusFilter[request.status]) &&
      (Object.keys(categoryFilter).length === 0 || categoryFilter[request.category]) &&
      Object.keys(request).some(key => String(request[key]).toLowerCase().includes(searchTerm.toLowerCase()))
    ));
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
    setStatusFilter(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(prev => {
      const newFilter = { ...prev };
      if (category === "All") {
        if (Object.keys(newFilter).length === Object.keys(allCategories).length) {
          // If all categories are already selected, unselect all
          return {};
        } else {
          // Select all categories
          Object.keys(allCategories).forEach(cat => newFilter[cat] = true);
          return newFilter;
        }
      } else {
        delete newFilter[category];
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

  const allCategories = {
    "Logistics": true,
    "Maintenance": true,
    "Education": true,
    "Electronics": true,
    "Health": true,
    "Essentials": true,
    "Childcare": true,
    "Pets": true,
    "Shopping": true,
    "Charity": true,
    "Events": true,
    "Marketing": true,
    "Administration": true,
    "Research": true
  };

  // Default categoryFilter to include all categories
  if (Object.keys(categoryFilter).length === 0) {
    setCategoryFilter(allCategories);
  }

  const requests = requestsData[activeTab].data;

  return (
    <div className="p-5">
      <div className="flex gap-4 mb-5">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          <Link to="/request" className="text-white">Create Help Request</Link>
        </button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={newVolunteer}>Promote Yourself To Volunteer</button>
      </div>

      <div className="flex mb-5">
        {["myRequests", "othersRequests", "managedRequests"].map(tab => (
          <button
            key={tab}
            className={`flex-1 py-2 text-center cursor-pointer border-b-2 ${activeTab === tab ? "bg-white border-gray-300" : "bg-gray-200 border-transparent"} ${tab !== "managedRequests" ? "mr-1" : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === "myRequests" ? "My Requests" : tab === "othersRequests" ? "Others Requests" : "Managed Requests"}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded flex-grow"
        />
        <div className="flex items-center">
          <span>Status:</span>
          <label className="mx-2">
            <input
              type="checkbox"
              checked={statusFilter.Open}
              onChange={() => handleStatusChange("Open")}
            />
            Open
          </label>
          <label className="mx-2">
            <input
              type="checkbox"
              checked={statusFilter.Closed}
              onChange={() => handleStatusChange("Closed")}
            />
            Closed
          </label>
        </div>
        <div className="flex items-center">
          <span>Rows per view:</span>
          <label className="mx-2">
            <input
              type="checkbox"
              checked={rowsPerPage === 5}
              onChange={() => handleRowsPerPageChange(5)}
            />
            5 rows
          </label>
          <label className="mx-2">
            <input
              type="checkbox"
              checked={rowsPerPage === 10}
              onChange={() => handleRowsPerPageChange(10)}
            />
            10 rows
          </label>
          <label className="mx-2">
            <input
              type="checkbox"
              checked={rowsPerPage === 20}
              onChange={() => handleRowsPerPageChange(20)}
            />
            20 rows
          </label>
        </div>
      </div>

      <div className="mb-4 relative">
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
                checked={Object.keys(categoryFilter).length === Object.keys(allCategories).length}
                onChange={() => handleCategoryChange("All")}
              />
              All Categories
            </label>
            {Object.keys(allCategories).map(category => (
              <label key={category} className="block">
                <input
                  type="checkbox"
                  checked={categoryFilter[category]}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
        )}
      </div>

      {activeTab && (
        <div className="requests-section">
          <Table
            headers={headers}
            rows={filteredRequests(requests)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages(requests)}
            totalRows={filteredRequests(requests).length}
            itemsPerPage={rowsPerPage}
            sortConfig={sortConfig}
            requestSort={requestSort}
            categoryFilter={categoryFilter}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
