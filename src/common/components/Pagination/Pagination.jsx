import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) => {
  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-2 py-1 border ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center mb-2">
          <span className="mr-2">Showing {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, totalPages * rowsPerPage)} of {totalPages * rowsPerPage} rows</span>
          <div className="flex items-center ml-2">
            <label htmlFor="rowsPerPage" className="mr-2">Rows per view:</label>
            <select id="rowsPerPage" value={rowsPerPage} onChange={(e) => onRowsPerPageChange(Number(e.target.value))} className="border rounded px-2 py-1">
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-700"
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
