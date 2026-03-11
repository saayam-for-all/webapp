import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
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
  const paginatedRequests = useMemo(() => {
    return rows.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [rows, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [totalRows, itemsPerPage, setCurrentPage]);

  const formatDateTime = (value, header) => {
    if (header === "creationDate" || header === "updatedDate") {
      if (!value) return "";

      try {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        const datePart = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const timePart = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        return `${datePart} ${timePart}`;
      } catch (error) {
        console.error("Error formatting date:", error);
        return value;
      }
    }
    return value;
  };

  const dataKeyMap = { requestId: "id", beneficiaryId: "userId" };
  const resolveKey = (header) => dataKeyMap[header] || header;

  const getCellValue = (row, header) => {
    if (header === "requestId") return row[resolveKey(header)];
    return formatDateTime(row[header], header);
  };

  const shouldLinkCell = (header) => header === "requestId" || header === "id";

  return (
    <div className="relative h-full" data-testid="container">
      <div className="overflow-auto h-4/5 mx-4 mt-2 rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full" data-testid="table">
          <thead
            data-testid="table-header"
            className="bg-gradient-to-r from-slate-100 to-gray-200 sticky top-0"
          >
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                  data-testid="map-header-one"
                >
                  <button
                    type="button"
                    onClick={() => requestSort(resolveKey(key))}
                    className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group"
                  >
                    <span>
                      {key.charAt(0).toUpperCase() +
                        key
                          .slice(1)
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                    </span>
                    <span
                      className={`text-sm transition-all ${
                        sortConfig.key === resolveKey(key)
                          ? "text-blue-600 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {sortConfig.key === resolveKey(key)
                        ? sortConfig.direction === "ascending"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            className="bg-white divide-y divide-gray-100"
            data-testid="table-body"
          >
            {paginatedRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-16 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-1">
                      No requests found
                    </p>
                    <p className="text-sm text-gray-500">
                      {rows.length === 0
                        ? "There are no requests to display."
                        : "Try adjusting your filters to see more results."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRequests.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-blue-50/50 transition-colors duration-150"
                >
                  {headers.map((header, colIndex) => {
                    const value = getCellValue(row, header);

                    const path =
                      shouldLinkCell(header) && getLinkPath
                        ? getLinkPath(row, header)
                        : null;

                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-3.5 text-sm text-gray-700"
                        data-testid="map-data-one"
                      >
                        {path ? (
                          <Link
                            to={path}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                            state={getLinkState ? getLinkState(row) : {}}
                          >
                            {value}
                          </Link>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
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

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalRows: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(["ascending", "descending"]),
  }).isRequired,
  requestSort: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  getLinkPath: PropTypes.func.isRequired,
  getLinkState: PropTypes.func,
};

export default Table;
