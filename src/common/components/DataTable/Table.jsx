import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

const Table = ({ headers, rows, currentPage, setCurrentPage, totalPages, totalRows, itemsPerPage, sortConfig, requestSort }) => {

  const paginatedRequests = useMemo(() => {
    return rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [rows, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [totalRows]);

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
