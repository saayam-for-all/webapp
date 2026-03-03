import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";

const Table = ({
  headers,
  rows,
  currentPage,
  setCurrentPage,
  totalPages,
  totalRows,
  itemsPerPage,
  sortConfig,
  requestSort,
  onRowsPerPageChange,
  getLinkPath,
  getLinkState = undefined,
}) => {
  const navigate = useNavigate();
  const paginatedRequests = useMemo(() => {
    return rows.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [rows, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [totalRows, itemsPerPage]);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  return (
    <div className="relative h-full" data-testid="container">
      <div className="overflow-auto h-4/5">
        <table
          className="min-w-full divide-y divide-gray-200"
          data-testid="table"
        >
          <thead className="" data-testid="table-header">
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                  data-testid="map-header-one"
                >
                  <button type="button" onClick={() => requestSort(key)}>
                    {key.charAt(0).toUpperCase() +
                      key
                        .slice(1)
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    {getSortIndicator(key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className="bg-white divide-y divide-gray-200 "
            data-testid="table-body"
          >
            {paginatedRequests.map((request, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap"
                    data-testid="map-data-one"
                  >
                    {header === "id" ? (
                      <Link
                        to={getLinkPath(request, header)}
                        className="text-indigo-600 hover:text-indigo-900"
                        state={getLinkState ? getLinkState(request) : {}}
                      >
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
      </div>
      <div className="h-1/5">
        {rows.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={itemsPerPage}
            totalRows={totalRows}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Table;
