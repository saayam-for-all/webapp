import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Table from "../../common/components/DataTable/Table";
import { requestsData } from "./data";

const Dashboard = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState("myRequests");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Open");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const headers = ["id", "type", "subject", "creationDate", "closedDate", "status", "category", "priority", "calamity"];

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
      (typeFilter === "All" || request.type === typeFilter) &&
      (statusFilter === "All" || request.status === statusFilter) &&
      Object.keys(request).some(key => String(request[key]).toLowerCase().includes(searchTerm.toLowerCase()))
    ));
  };

  const paginatedRequests = (requests) => {
    const itemsPerPage = 5;
    const filtered = filteredRequests(requests);
    return filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  const totalPages = (requests) => {
    const itemsPerPage = 5;
    return Math.ceil(filteredRequests(requests).length / itemsPerPage);
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

  return (
    <div className="p-5">
      <div className="flex gap-4 mb-5">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          <Link to="/request" className="text-white">Create Help Request</Link>
        </button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Promote Yourself To Volunteer</button>
      </div>

      <div className="flex gap-4 mb-5 border-b-2 border-gray-300">
        {["myRequests", "othersRequests", "managedRequests"].map(tab => (
          <button
            key={tab}
            className={`flex-1 py-2 text-center cursor-pointer ${activeTab === tab ? "bg-white border-t-2 border-r-2 border-l-2 border-gray-300" : "bg-gray-200"}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === "myRequests" ? "My Requests" : tab === "othersRequests" ? "Others Requests" : "Managed Requests"}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4 p-2 border rounded"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="mr-2 p-2 border rounded">
          <option value="All">All Types</option>
          <option value="Personal">Personal</option>
          <option value="For Others">For Others</option>
          <option value="Managed">Managed</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border rounded">
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {activeTab && (
        <div className="requests-section">
          <Table headers={headers} rows={paginatedRequests(requestsData[activeTab].data)} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages(requestsData[activeTab].data)} totalRows={filteredRequests(requestsData[activeTab].data).length} itemsPerPage={5} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
