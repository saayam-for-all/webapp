import React from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  totalRows,
  onRowsPerPageChange,
}) => {
  const renderPageNumbers = () => {
    let pages = [];
    const maxFirstPages = 5;
    const pageRange = 2;

    // show the first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`min-w-[36px] h-9 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
          1 === currentPage
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        }`}
      >
        {1}
      </button>,
    );

    // show ... if there are more pages
    if (currentPage >= maxFirstPages) {
      pages.push(
        <span key="ellipsis-start" className="px-2 text-gray-400">
          ...
        </span>,
      );
      for (let i = currentPage - pageRange; i <= currentPage + pageRange; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`min-w-[36px] h-9 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                i === currentPage
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {i}
            </button>,
          );
        }
      }
    } else {
      if (totalPages > 2) {
        for (let i = 2; i <= Math.min(maxFirstPages, totalPages - 1); i++) {
          pages.push(
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`min-w-[36px] h-9 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                i === currentPage
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {i}
            </button>,
          );
        }
      }
    }

    if (currentPage + pageRange < totalPages) {
      pages.push(
        <span key="ellipsis-end" className="px-2 text-gray-400">
          ...
        </span>,
      );
    }

    if (pages.length < totalPages) {
      // show the last page
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`min-w-[36px] h-9 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            totalPages === currentPage
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          {totalPages}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="px-4 py-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium text-gray-800">
              {(currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-800">
              {Math.min(currentPage * rowsPerPage, totalRows)}
            </span>{" "}
            of <span className="font-medium text-gray-800">{totalRows}</span>{" "}
            entries
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-sm text-gray-600">
              Show:
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
              currentPage === 1
                ? "opacity-0 pointer-events-none"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}
          >
            <RiArrowLeftSLine className="w-5 h-5" />
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
              currentPage === totalPages
                ? "opacity-0 pointer-events-none"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}
          >
            <RiArrowRightSLine className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
