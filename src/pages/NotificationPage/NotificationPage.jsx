import { IoSettingsOutline } from "react-icons/io5";
import NotificationListItem from "./NotificationListItem";
import { useState } from "react";

const NotificationPage = () => {
  const allNotifications = [
    {
      id: 3,
      message:
        "Test notification unread Test notification unread Test notification unread Test notification unread Test notification unread Test notification unread Test notification unread Test notification unread",
      date: "09/01/2024",
      time: "5:00 pm",
      isRead: false,
      type: "help-request",
    },
    {
      id: 2,
      message: "Test notification unread",
      date: "09/01/2024",
      time: "4:00 pm",
      isRead: false,
      type: "volunteer-match",
    },
    {
      id: 1,
      message: "Test notification read",
      date: "09/01/2024",
      time: "3:00 pm",
      isRead: true,
      type: "volunteer-match",
    },
  ];

  const [notificationData, setNotificationData] = useState(allNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const handleTabChange = (category) => {
    setActiveTab(category);
    if (category === "all") {
      setNotificationData(allNotifications);
    } else {
      const temp = allNotifications.filter(
        (notification) => notification.type === category
      );
      setNotificationData(temp);
    }
  };

  return (
    <div id="main-container" className="my-4">
      <div
        id="category-container"
        className="my-8 px-4 py-4 flex flex-row rounded-lg bg-gray-200"
      >
        <div className="flex flex-row">
          <button
            className={`px-4 mx-4 border border-blue-600 rounded-2xl text-gray-900 hover:bg-blue-800 hover:text-white ${
              activeTab === "all" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => handleTabChange("all")}
          >
            All
          </button>
          <button
            className={`px-4 mx-4 border border-blue-600 rounded-2xl text-gray-900 hover:bg-blue-800 hover:text-white ${
              activeTab === "help-request" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => handleTabChange("help-request")}
          >
            Help Requests
          </button>
          <button
            className={`px-4 mx-4 border border-blue-600 rounded-2xl text-gray-900 hover:bg-blue-800 hover:text-white ${
              activeTab === "volunteer-match" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => handleTabChange("volunteer-match")}
          >
            Volunteer Matches
          </button>
        </div>
        <button className="ml-auto mr-4 text-2xl">
          <IoSettingsOutline />
        </button>
      </div>

      <div id="notification-list" className="my-4 bg-gray-200 rounded-lg">
        {notificationData.map((notification) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
