import React from "react";
import avatar from "../../assets/avatar.jpg";

const CommentSection = ({ name, message, date }) => {
  return (
    <article class="pt-6 mb-3 text-base bg-white border-t border-gray-200">
      <footer class="flex justify-between items-center mb-2">
        <div class="flex items-center">
          <p class="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
            <img class="mr-2 w-8 h-8 rounded-full" src={avatar} alt={name} />
            {name}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <time pubdate datetime="2022-03-12" title={date}>
              {date}
            </time>
          </p>
        </div>

        <details className="dropdown dropdown-end">
          <summary className="btn m-1 p-1 bg-white shadow-none h-8 min-h-8 hover:bg-white">
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>
              <a>Edit</a>
            </li>
            <li>
              <a>Delete</a>
            </li>
          </ul>
        </details>
      </footer>
      <p class="text-gray-500">{message}</p>
    </article>
  );
};

export default CommentSection;
