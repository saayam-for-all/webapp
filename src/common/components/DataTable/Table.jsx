import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";

const Table = ({ headers, rows, currentPage, setCurrentPage, totalPages, totalRows, itemsPerPage, sortConfig, requestSort }) => {

  const paginatedRequests = useMemo(() => {
    return rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [rows, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [totalRows, itemsPerPage]);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  return (
    <div className="relative">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(key => (
              <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button type="button" onClick={() => requestSort(key)}>
                  {key === 'category' && !rows.every(row => row[key]) ? 'Category' : key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  {getSortIndicator(key)}
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
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalRows={totalRows}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default Table;
