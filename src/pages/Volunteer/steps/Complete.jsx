import React from "react";
import { Link } from "react-router-dom";

const Complete = () => {
  return (
    <div className="container md:mt-6">
      <div className="flex flex-col items-center">
        <div className="text-green-400">
          <svg
            className="w-24 h-24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
        </div>
        <div className="mt-3 text-xl font-semibold uppercase text-green-500">
          Congratulations
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mx-auto mt-12">
          <Link to="/dashboard">Close</Link>
        </button>
      </div>
    </div>
  );
};

export default Complete;
