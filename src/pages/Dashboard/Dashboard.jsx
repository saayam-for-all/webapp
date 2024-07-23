import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardTable from "./DashboardTable/DashboardTable";

const Dashboard = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState("myRequests");

  const requestsData = {
    myRequests: {
      data: [
        {
          id: 1,
          type: "Personal",
          subject: "Need headphone",
          creationDate: "2024-06-01",
          closedDate: null,
          status: "Open",
          category: "Electronics",
          priority: "High",
          calamity: "None",
        },
        {
          id: 2,
          type: "Personal",
          subject: "Medicine pickup",
          creationDate: "2024-06-10",
          closedDate: null,
          status: "Open",
          category: "Health",
          priority: "Medium",
          calamity: "None",
        },
      ],
    },
    othersRequests: {
      data: [
        {
          id: 1,
          type: "For Others",
          subject: "Help picking up the delivery",
          creationDate: "2024-06-03",
          closedDate: null,
          status: "Open",
          category: "Logistics",
          priority: "Low",
          calamity: "None",
        },
        {
          id: 2,
          type: "For Others",
          subject: "Collect donations",
          creationDate: "2024-06-12",
          closedDate: "2024-06-15",
          status: "Closed",
          category: "Charity",
          priority: "High",
          calamity: "None",
        },
      ],
    },
    managedRequests: {
      data: [
        {
          id: 1,
          type: "Managed",
          subject: "Grocery Delivery",
          creationDate: "2024-06-03",
          closedDate: null,
          status: "Open",
          category: "Essentials",
          priority: "Medium",
          calamity: "None",
        },
        {
          id: 2,
          type: "Managed",
          subject: "Manage donations",
          creationDate: "2024-06-12",
          closedDate: "2024-06-15",
          status: "Closed",
          category: "Charity",
          priority: "High",
          calamity: "None",
        },
      ],
    },
  };

  return (
    <div className="p-5">
      <div className="flex gap-4 mb-5">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          <Link to="/request" className="text-white">Create Help Request</Link>
        </button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Promote Yourself To Volunteer</button>
      </div>

      <div className="flex gap-4 mb-5 border-b-2 border-gray-300">
        <button
          className={`flex-1 py-2 text-center cursor-pointer ${activeTab === "myRequests" ? "bg-white border-t-2 border-r-2 border-l-2 border-gray-300" : "bg-gray-200"}`}
          onClick={() => setActiveTab("myRequests")}
        >
          My Requests
        </button>
        <button
          className={`flex-1 py-2 text-center cursor-pointer ${activeTab === "othersRequests" ? "bg-white border-t-2 border-r-2 border-l-2 border-gray-300" : "bg-gray-200"}`}
          onClick={() => setActiveTab("othersRequests")}
        >
          Others Requests
        </button>
        <button
          className={`flex-1 py-2 text-center cursor-pointer ${activeTab === "managedRequests" ? "bg-white border-t-2 border-r-2 border-l-2 border-gray-300" : "bg-gray-200"}`}
          onClick={() => setActiveTab("managedRequests")}
        >
          Managed Requests
        </button>
      </div>

      {activeTab && (
        <div className="requests-section">
          <DashboardTable requests={requestsData[activeTab].data} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
