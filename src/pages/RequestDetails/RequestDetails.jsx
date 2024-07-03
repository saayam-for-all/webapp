import avatar from "../../assets/avatar.jpg";
import CommentSection from "./CommentSection";

const comments = [
  {
    name: "Emily Green",
    message:
      "I've participated in similar events before, and they're always rewarding. Happy to help!",
    date: "July 2, 2024",
  },
  {
    name: "Michael Brown",
    message: " Great idea! Let's make our community sparkle.",
    date: "July 1, 2024",
  },
];

const RequestDetails = () => {
  return (
    <div className="m-8">
      <div className="rounded-lg bg-white p-6 text-surface shadow-lg">
        <div className="flex items-center mb-6">
          <img
            src={avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <div className="text-lg font-medium text-gray-800">
              Peter Parker
            </div>
            <div className="text-gray-500">2 days ago</div>
          </div>
        </div>
        <div className="flex gap-2 items-center justify-start">
          <h2 className="text-2xl font-semibold">
            Help Needed for Community Clean-Up Event
          </h2>
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            Open
          </span>
        </div>
        <ul className="flex flex-wrap gap-2 text-xs text-gray-500">
          <li>#12345</li>
          <li>Created July 1, 2024</li>
          <li>Last Updated 2 hours ago</li>
        </ul>

        <h4 className="mt-4 text-base font-semibold">Description</h4>
        <p className="text-sm">
          We need volunteers for our upcoming Community Clean-Up Day on August
          15 from 9:00 AM to 1:00 PM at Cherry Creek Park. Tasks include picking
          up litter, sorting recyclables, and managing the registration table.
          We also need donations of trash bags, gloves, and refreshments. Your
          support will help make our community cleaner and more enjoyable for
          everyone.
        </p>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">2 Comments </h2>
        <div class="flex mt-4">
          <div class="flex-shrink-0 mr-3">
            <img
              class="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
              src={avatar}
              alt=""
            />
          </div>
          <form class="mb-6 w-full">
            <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-20">
              <label for="comment" class="sr-only">
                Add your comment
              </label>
              <textarea
                id="comment"
                rows="4"
                class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none "
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              class="btn btn-success text-white h-10 min-h-10"
            >
              Post
            </button>
          </form>
        </div>
        {comments.map((comment) => {
          const { message, name, date } = comment;
          return <CommentSection message={message} name={name} date={date} />;
        })}
      </div>
    </div>
  );
};

export default RequestDetails;
