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
      <div className="overflow-auto h-4/5">
        <table
          className="min-w-full divide-y divide-gray-200"
          data-testid="table"
        >
          <thead data-testid="table-header">
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                  data-testid="map-header-one"
                >
                  <button
                    type="button"
                    onClick={() => requestSort(resolveKey(key))}
                  >
                    {key.charAt(0).toUpperCase() +
                      key
                        .slice(1)
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    {getSortIndicator(resolveKey(key))}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            className="bg-white divide-y divide-gray-200"
            data-testid="table-body"
          >
            {paginatedRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold mb-2">
                      No requests found
                    </p>
                    <p className="text-sm">
                      {rows.length === 0
                        ? "There are no requests to display."
                        : "Try adjusting your filters to see more results."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRequests.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, colIndex) => {
                    const value = getCellValue(row, header);

                    const path =
                      shouldLinkCell(header) && getLinkPath
                        ? getLinkPath(row, header)
                        : null;

                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-2"
                        data-testid="map-data-one"
                      >
                        {path ? (
                          <Link
                            to={path}
                            className="text-indigo-600 hover:text-indigo-900"
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
