import React from "react";
import { Link } from "react-router-dom";

const Table = ({
  headers = [],
  rows = [],
  sortConfig = null,
  requestSort = () => {},
  getLinkPath = () => "#",
  getLinkState = undefined,
}) => {
  const getSortIndicator = (key) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  return (
    <div className="relative h-full" data-testid="container">
      <div className="overflow-y-auto h-full">
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
            {rows.map((request, rowIndex) => (
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
    </div>
  );
};

export default Table;
