import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalPages, totalRows, itemsPerPage }) => {
    const renderPageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 border ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex flex-col items-center mt-4">
            <span className="mb-2">Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalRows)} of {totalRows} rows</span>
            <div className="flex space-x-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Previous
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
