import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

const Table = ({ headers, rows, currentPage, setCurrentPage, totalPages, totalRows, itemsPerPage }) => {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Open");

  const sortedRequests = useMemo(() => {
    let sortableRequests = [...rows];
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
  }, [rows, sortConfig]);

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

  const handleTypeFilterChange = event => {
    setTypeFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = event => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setStatusFilter("Open");
  }, []);

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(key => (
              <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button type="button" onClick={() => requestSort(key)}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedRequests.map((request, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  {header === 'id' ? (
                    <Link to={`/request/${request[header]}`} className="text-indigo-600 hover:text-indigo-900">
                      {request[header]}
                    </Link>
                  ) : (
                    request[header]
                  )}
                </td>
              ))}
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
          Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalRows)} of {totalRows} rows
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

export default Table;
