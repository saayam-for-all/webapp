import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

const DashboardTable = ({ requests, currentPage, setCurrentPage }) => {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Open");
  const itemsPerPage = 5;

  const sortedRequests = useMemo(() => {
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
  }, [requests, sortConfig]);

  const filteredRequests = sortedRequests.filter(request => (
    (typeFilter === "All" || request.type === typeFilter) &&
    (statusFilter === "All" || request.status === statusFilter) &&
    Object.keys(request).some(key => String(request[key]).toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = key => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  useEffect(() => {
    setStatusFilter("Open");
  }, []);

  return (
    <div>
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["id", "type", "subject", "creationDate", "closedDate", "status", "category", "priority", "calamity"].map(key => (
              <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button type="button" onClick={() => requestSort(key)}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedRequests.map(request => (
            <tr key={request.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/request/${request.id}`} className="text-indigo-600 hover:text-indigo-900">
                  {request.id}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{request.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">{request.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap">{request.creationDate}</td>
              <td className="px-6 py-4 whitespace-nowrap">{request.closedDate || ""}</td>
              <td className="px-6 py-4 whitespace-nowrap">{request.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">{request.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">{request.priority}</td>
              <td className="px-6 py-4 whitespace-nowrap">{request.calamity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Previous
        </button>
        <span>
          Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} rows
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DashboardTable;
