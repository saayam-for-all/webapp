import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination/Pagination";

const requestEnumNamespaceMap = {
  status: "requestStatus",
  priority: "requestPriority",
};

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
  serverPaginated = false,
  showCheckboxes = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
}) => {
  const { t, i18n } = useTranslation(["common", "categories", "enums"]);

  const paginatedRequests = useMemo(() => {
    if (serverPaginated) {
      return rows;
    }

    return rows.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [rows, currentPage, itemsPerPage, serverPaginated]);

  //useEffect(() => {
  //setCurrentPage(1);
  //}, [totalRows, itemsPerPage, setCurrentPage]);

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

  const dataKeyMap = {
    requestId: "requestId",
    beneficiaryId: "userId",
    category: "requestCategory",
  };
  const resolveKey = (header) => dataKeyMap[header] || header;

  const headerLabelMap = {
    status: t("STATUS"),
    subject: t("SUBJECT"),
    type: t("TYPE"),
    category: t("Category"),
    priority: t("PRIORITY"),
    requestId: t("Request ID"),
    updatedDate: t("Last Updated"),
    creationDate: t("Created"),
    calamity: t("Calamity"),
    beneficiaryCreatorDisplayId: t("Beneficiary ID / Creator ID"),
    leadVolunteerDisplayId: t("Lead Volunteer ID"),
  };

  const getCategoryLabel = (code) => {
    if (!code) return code;
    const bundle =
      i18n.getResourceBundle(i18n.language, "categories") ||
      i18n.getResourceBundle("en", "categories");
    if (!bundle?.REQUEST_CATEGORIES) return code;
    const search = (obj, target) => {
      for (const key in obj) {
        if (key === target && obj[key].LABEL) return obj[key].LABEL;
        if (obj[key].SUBCATEGORIES) {
          const found = search(obj[key].SUBCATEGORIES, target);
          if (found) return found;
        }
      }
      return null;
    };
    return search(bundle.REQUEST_CATEGORIES, code) || code;
  };

  const splitRequestIdLines = (requestId) => {
    if (typeof requestId !== "string") return [requestId];
    const parts = requestId.split("-");
    if (parts.length < 5) return [requestId];

    return [
      `${parts[0]}-${parts[1]}-`,
      `${parts[2]}-${parts[3]}-`,
      parts.slice(4).join("-"),
    ];
  };

  const getRequestEnumLabel = (header, value) => {
    const enumNamespace = requestEnumNamespaceMap[header];
    if (value === null || value === undefined || value === "") {
      return value;
    }

    const lookupValue = String(value).trim().toUpperCase().replace(/\s+/g, "_");
    if (!lookupValue) return value;

    return t(`enums:${enumNamespace}.${lookupValue}`, {
      defaultValue: value,
    });
  };

  const getCellValue = (row, header) => {
    if (header === "requestId") return row[resolveKey(header)];
    if (header === "category") return getCategoryLabel(row[resolveKey(header)]);
    const rawValue = row[resolveKey(header)];
    if (requestEnumNamespaceMap[header]) {
      return getRequestEnumLabel(header, rawValue);
    }
    const value = formatDateTime(rawValue, header);
    if (
      ["beneficiaryCreatorDisplayId", "leadVolunteerDisplayId"].includes(
        header,
      ) &&
      (value === null || value === undefined || value === "")
    ) {
      return "—";
    }
    return value;
  };

  const renderRequestId = (requestId) =>
    splitRequestIdLines(requestId).map((line, index) => (
      <span
        key={`${requestId}-${index}`}
        className="block whitespace-nowrap leading-tight"
      >
        {line}
      </span>
    ));

  const getCellClassName = (header) => {
    if (header === "requestId") {
      return "px-3 py-2 text-sm leading-tight align-top";
    }
    if (
      ["beneficiaryCreatorDisplayId", "leadVolunteerDisplayId"].includes(header)
    ) {
      return "px-6 py-2 whitespace-nowrap text-sm";
    }
    return "px-6 py-2";
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
              {showCheckboxes && (
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    className="cursor-pointer w-4 h-4"
                    checked={
                      paginatedRequests.length > 0 &&
                      paginatedRequests.every((row) =>
                        selectedRows.includes(row.requestId || row.id),
                      )
                    }
                    onChange={(e) =>
                      onSelectAll && onSelectAll(e.target.checked)
                    }
                  />
                </th>
              )}
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
                    {headerLabelMap[key] ||
                      key.charAt(0).toUpperCase() +
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
                  colSpan={headers.length + (showCheckboxes ? 1 : 0)}
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
                  {showCheckboxes && (
                    <td className="px-3 py-2 w-10">
                      <input
                        type="checkbox"
                        className="cursor-pointer w-4 h-4"
                        checked={selectedRows.includes(row.requestId || row.id)}
                        onChange={() =>
                          onRowSelect && onRowSelect(row.requestId || row.id)
                        }
                      />
                    </td>
                  )}
                  {headers.map((header, colIndex) => {
                    const value = getCellValue(row, header);

                    const path = getLinkPath ? getLinkPath(row, header) : null;

                    let cellContent = value;

                    if (header === "requestId") {
                      cellContent = renderRequestId(value);
                    }

                    if (header === "type") {
                      cellContent = t(cellContent);
                    }

                    return (
                      <td
                        key={colIndex}
                        className={getCellClassName(header)}
                        data-testid="map-data-one"
                      >
                        {path ? (
                          <Link
                            to={path}
                            className="text-indigo-600 hover:text-indigo-900"
                            state={
                              getLinkState
                                ? getLinkState(row, header)
                                : undefined
                            }
                          >
                            {cellContent}
                          </Link>
                        ) : (
                          cellContent
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
  serverPaginated: PropTypes.bool,
  showCheckboxes: PropTypes.bool,
  selectedRows: PropTypes.array,
  onRowSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
};

export default Table;
