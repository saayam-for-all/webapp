import NotificationListItem from "./NotificationListItem";
import EmptyNotificationList from "./EmptyNotificationList";
import { useState } from "react";

const NotificationPage = () => {
  const allNotifications = [
    {
      id: 3,
      subject: "Help needed for cooking",
      date: "09/01/2024",
      time: "5:00 pm",
      isRead: false,
      category: "Cooking",
      type: "help-request",
    },
    {
      id: 2,
      subject: "Help needed for medical issue",
      date: "09/01/2024",
      time: "4:00 pm",
      isRead: false,
      category: "Medical",
      type: "volunteer-match",
    },
    {
      id: 1,
      subject:
        "Help needed for medical issue Help needed for medical issue Help needed for medical issue Help needed for medical issue",
      date: "09/01/2024",
      time: "3:00 pm",
      isRead: true,
      category: "Medical",
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
        className="my-8 px-4 py-6 flex flex-row rounded-lg bg-gray-100 shadow-lg"
      >
        <div className="flex flex-row">
          <button
            className={`px-6 py-2 mx-4 border border-blue-600 rounded-3xl text-gray-500 hover:bg-blue-800 hover:text-white ${
              activeTab === "all" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => handleTabChange("all")}
          >
            All
          </button>
          <button
            className={`px-6 py-2 mx-4 border border-blue-600 rounded-3xl text-gray-500 hover:bg-blue-800 hover:text-white ${
              activeTab === "help-request" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => handleTabChange("help-request")}
          >
            Help Requests
          </button>
          <button
            className={`px-6 py-2 mx-4 border border-blue-600 rounded-3xl text-gray-500 hover:bg-blue-800 hover:text-white ${
              activeTab === "volunteer-match" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => handleTabChange("volunteer-match")}
          >
            Volunteer Matches
          </button>
        </div>
      </div>

      <div
        id="notification-list"
        className="bg-gray-100 rounded-lg overflow-hidden shadow-lg"
      >
        {notificationData && notificationData.length > 0 ? (
          notificationData.map((notification) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <EmptyNotificationList />
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
