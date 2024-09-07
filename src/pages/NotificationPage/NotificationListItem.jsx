import { IoPersonCircleOutline } from "react-icons/io5";

const NotificationListItem = ({ notification }) => {
  return (
    <div
      id="list-item-container"
      className={`px-4 py-4 flex flex-row border-b-2 border-gray-400 ${
        !notification.isRead ? "bg-blue-100" : ""
      }`}
    >
      <IoPersonCircleOutline className="text-6xl flex-shrink-0" />
      <div id="message-button-container" className="px-4 mr-auto">
        <p id="message" className="ml-2">
          {notification.message}
        </p>
        <div id="button-container" className="mt-4">
          <button className="px-4 py-2 mx-4 my-2 bg-blue-600 text-white rounded-xl hover:bg-blue-800">
            Accept
          </button>
          <button className="px-4 py-2 mx-4 my-2 border border-red-600 rounded-xl hover:bg-red-600 hover:text-white">
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
