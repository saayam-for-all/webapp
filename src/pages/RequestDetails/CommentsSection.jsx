import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Comments from "./Comments";

/* // Get the current system date
  const systemDate = new Date();
  const formattedDate = systemDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  */

const CommentsSection = ({ comments }) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [commentsData, setComments] = useState([]);

  const getComments = async () => {
    try {
      const response = await getRequestComments();
      setComments(response?.body);
    } catch (error) {
      console.error("Error fetching volunteer organizations:", error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleSortChange = () =>
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));

  const filteredComments = comments
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.message.toLowerCase().includes(searchText.toLowerCase()),
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);

  const handlePaginationClick = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-end items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "invisible"
              : "bg-gray-200 hover:bg-gray-300 text-black"
          }`}
        >
          Previous
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded ${
              number === currentPage
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "invisible"
              : "bg-gray-200 hover:bg-gray-300 text-black"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      // submit comment logic
      setComment("");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div
          className="flex items-center space-x-2"
          style={{ flexBasis: "50%" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Comment Input Field */}
          <input
            type="text"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write a comment....."
            className="flex-1 px-4 py-2 bg-gray-100 outline-none border-2 border-white text-gray-600 placeholder-gray-400 text-sm rounded focus:border-black focus:outline-none"
          />

          {/* Send Button */}
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
            onClick={handleSubmit}
          >
            {/* Send message icon - Paper Plane */}
            <svg
              className="w-5 h-5 transform rotate-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
              style={{ transform: "rotate(-30deg)" }}
            >
              <path d="M2.003 21L23 12 2.003 3 2 10l15 2-15 2 .003 7z" />
            </svg>
          </button>
        </div>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <div className="mt-4 bg-gray-100 p-6 shadow-md w-full rounded-lg">
          <div className="flex items-center justify-between bg-white p-3 mb-3 rounded-lg shadow-sm border border-gray-200">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="px-4 py-2 bg-gray-100 outline-none border-2 border-white text-sm rounded-md w-1/3 focus:border-black focus:outline-none"
            />

            <button
              onClick={handleSortChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              {t("SORT_BY")}:{" "}
              {sortOrder === "newest" ? t("NEWEST") : t("OLDEST")}
            </button>
          </div>
          {currentComments.map((comment) => {
            const { message, name, date, id } = comment;
            return (
              <Comments
                key={comment.id}
                message={message}
                name={name}
                date={date}
              />
            );
          })}
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
