import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardTable from "./DashboardTable/DashboardTable";
import { requestsData } from "./data"; 

const Dashboard = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState("myRequests");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); 
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
        {["myRequests", "othersRequests", "managedRequests"].map(tab => (
          <button
            key={tab}
            className={`flex-1 py-2 text-center cursor-pointer ${activeTab === tab ? "bg-white border-t-2 border-r-2 border-l-2 border-gray-300" : "bg-gray-200"}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === "myRequests" ? "My Requests" : tab === "othersRequests" ? "Others Requests" : "Managed Requests"}
          </button>
        ))}
      </div>

      {activeTab && (
        <div className="requests-section">
          <DashboardTable requests={requestsData[activeTab].data} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
