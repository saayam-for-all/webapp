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
  }, [totalRows, itemsPerPage]);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  const formatDateTime = (value, header) => {
    if (header === "creationDate" || header === "updatedDate") {
      if (!value) return "";

      try {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        // Format: MM/DD/YYYY | HH:MM AM/PM TZ
        const datePart = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const timePart = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        });
        return `${datePart} | ${timePart}`;
      } catch (error) {
        console.error("Error formatting date:", error);
        return value;
      }
    }
    return value;
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap"
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
                      formatDateTime(request[header], header)
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
