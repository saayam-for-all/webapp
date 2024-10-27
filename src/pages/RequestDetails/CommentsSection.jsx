import avatar from "../../assets/avatar.jpg";
import Comments from "./Comments";
import React from 'react' //Added for testing

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
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">2 Comments </h2>
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
  );
};

export default CommentsSection;
