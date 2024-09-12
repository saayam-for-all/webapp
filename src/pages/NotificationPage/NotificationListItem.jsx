import { BiSolidDonateHeart } from "react-icons/bi";
import { LiaHandsHelpingSolid } from "react-icons/lia";

const NotificationListItem = ({ notification }) => {
  const help_request_type = "help-request";
  const volunteer_match_category = "volunteer-match";

  return (
    <div
      id="list-item-container"
      className={`px-4 py-6 flex flex-row border-b-2 border-gray-300 ${
        !notification.isRead ? "bg-blue-100" : ""
      }`}
    >
      {notification.type === help_request_type ? (
        <BiSolidDonateHeart className="text-6xl flex-shrink-0 text-gray-400" />
      ) : (
        <LiaHandsHelpingSolid className="text-6xl flex-shrink-0 text-gray-400" />
      )}
      <div id="message-button-container" className="px-4 mx-4 mr-auto">
        <p id="message" className="text-black font-bold">
          {notification.subject}
        </p>
        <p id="message" className="text-gray-500">
          {notification.category}
        </p>
        <div id="button-container" className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-800">
            Accept
          </button>
          <button className="px-4 py-2 mx-8 border border-red-600 rounded-xl hover:bg-red-600 hover:text-white">
            Reject
          </button>
        </div>
      </div>
      <div
        id="time-container"
        className="mr-2 flex flex-col font-light text-sm"
      >
        <p>{notification.date}</p>
        <p>{notification.time}</p>
      </div>
    </div>
  );
};

export default NotificationListItem;
