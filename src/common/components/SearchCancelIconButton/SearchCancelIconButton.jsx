import React from "react";

/**
 * SearchCancelIconButton — icon button to clear/cancel a search input.
 * @param {Function} props.onClick - Fired on click; typically clears the search value.
 * @param {string} [props.className] - Extra classes to override default button styles.
 */
const SearchCancelIconButton = ({ onClick, className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Clear"
      className={`flex items-center justify-center text-gray-500 hover:text-gray-700 ${className}`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6l12 12M6 18L18 6"
        />
      </svg>
    </button>
  );
};

export default SearchCancelIconButton;
