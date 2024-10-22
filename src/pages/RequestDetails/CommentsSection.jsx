import avatar from "../../assets/avatar.jpg";
import Comments from "./Comments";
import React, { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

const comments = [
  {
    id: "1",
    name: "Emily Green",
    message:
      "I've participated in similar events before, and they're always rewarding. Happy to help!",
    date: "July 2, 2024",
  },
  {
    id: "2",
    name: "Michael Brown",
    message: " Great idea! Let's make our community sparkle.",
    date: "July 1, 2024",
  },
];

const CommentsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="mt-8">
      {/* <h2 className="text-xl font-bold">2 Comments </h2> */}
      {/* 
      <div className="flex mt-4">
        
      <div className="flex-shrink-0 mr-3">
          <img
            className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
            src={avatar}
            alt=""
          />
         
        </div> 
        
        <form className="mb-6 w-full">
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-20">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              id="comment"
              rows="4"
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none "
              placeholder="Write a comment..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn btn-success text-white h-10 min-h-10"
          >
            Post
          </button>
        </form>
        
      </div>
      */}
   {/* 
     <div className="rounded-lg bg-white border border-gray-200 p-4 sm:p-6 m-0" onClick={handleToggle}>
       <ul className="flex flex-wrap md:gap-2 lg:gap-14 text-xs text-gray-700 pt-5 items-center justify-between">
        <li className="flex items-center gap-1 ">
        <form className="flex items-center ">
        <div className="flex items-center p-2 border rounded-lg shadow-sm bg-gray-100 w-full">
        <input
          type="text"
          placeholder="Write a comment....."
          className="flex-1 px-4 py-2 border-none outline-none bg-gray-100 rounded-full text-sm"
        />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-500">
          // Send message icon 
          <svg className="w-5 h-5 transform" fill="currentColor" viewBox="0 0 24 24" stroke="none" style={{ transform: 'rotate(-30deg)' }}  >
            <path
              d="M2.003 21 23 12 2.003 3 2 10l15 2-15 2 .003 7z"
            />
          </svg>
        </button>    
      </div>  
        </form>
        </li>
        <li className="flex items-center gap-1 ml-auto">
              {isOpen ? (
                <IoIosArrowUp size={30} strokeWidth={2} />
              ) : (
                <IoIosArrowDown size={30} strokeWidth={2} />
              )}
            </li>
        </ul>
     </div>
     */}
     <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-200">
     <div className="flex items-center space-x-2" style={{ flexBasis: '50%' }}>
      {/* Comment Input Field */}
      <input
        type="text"
        placeholder="Write a comment....."
        className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none border-none text-gray-600 placeholder-gray-400 text-sm"
        style={{ borderRadius: '5px' }} 
      />

      {/* Send Button */}
      <button className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all">
        {/* Send message icon - Paper Plane */}
        <svg
          className="w-5 h-5 transform rotate-0"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="none"
          style={{ transform: 'rotate(-30deg)' }}
        >
          <path d="M2.003 21L23 12 2.003 3 2 10l15 2-15 2 .003 7z" />
        </svg>
      </button>
      </div>

      {/* Toggle Arrow */}
      <button onClick={handleToggle} className="ml-2">
        {isOpen ? (
          <IoIosArrowUp size={30} className="text-gray-600" />
        ) : (
          <IoIosArrowDown size={30} className="text-gray-600" />
        )}
      </button>
    </div>
        { isOpen && (
          <div className="mt-4 bg-gray-100 p-6 shadow-md w-full rounded-lg">
            
      {comments.map((comment) => {
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
    </div>
  )}
  </div>
  );
};

export default CommentsSection;
