import React from "react";
import { RiArrowLeftSLine } from "react-icons/ri";
import { RiArrowRightSLine } from "react-icons/ri";
const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) => {
  const renderPageNumbers = () => {
    let pages = [];
    const maxFirstPages = 5;
    const pageRange = 2;

    // show the first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`px-3 py-1 border rounded ${
          1 === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {1}
      </button>
    );

    // show ... if there are more pages
    if (currentPage >= maxFirstPages) {
      pages.push(
        <span key="ellipsis-start" className="px-3 py-1">
          ...
        </span>
      );
      for (let i = currentPage - pageRange; i <= currentPage + pageRange; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`px-3 py-1 border rounded ${
                i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {i}
            </button>
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
              className={`px-3 py-1 border rounded ${
                i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {i}
            </button>
          );
        }
      }
    }

    if (currentPage +  pageRange < totalPages) {
      pages.push(
        <span key="ellipsis-end" className="px-3 py-1">
          ...
        </span>
      );
    }

    // show the last page
    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className={`px-3 py-1 border rounded ${
          totalPages === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {totalPages}
      </button>
    );

    return pages;
  };

  return (
    <div className="mt-20 p-5" data-testid = 'divOne'>
      <div className="flex justify-between items-center" data-testid = 'divTwo'>
        <div className="flex items-center justify-center mb-2" data-testid = 'divThree'>
          <span className="mr-2 text-gray-400" data-testid = 'labelOne'>
            Showing data {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, totalPages * rowsPerPage)} of {totalPages * rowsPerPage} entries
          </span>
          {/* <div className="flex items-center ml-2">
            <label htmlFor="rowsPerPage" className="mr-2">Rows per view:</label>
            <select id="rowsPerPage" value={rowsPerPage} onChange={(e) => onRowsPerPageChange(Number(e.target.value))} className="border rounded px-2 py-1">
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
            </select>
          </div> */}
        </div>
        <div className="flex items-center space-x-2" data-testid = 'divFour'>
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-200 text-black py-2 px-2 rounded hover:bg-gray-500"
            data-testid = 'buttonOne'
          >
            <RiArrowLeftSLine/>
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-200 text-black py-2 px-2 rounded hover:bg-gray-500"
            data-testid = 'buttonTwo'
          >
            <RiArrowRightSLine/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
