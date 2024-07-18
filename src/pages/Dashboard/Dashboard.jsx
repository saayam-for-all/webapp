import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ t, userRole }) => {
  const [activeTab, setActiveTab] = useState("myRequests");

  const userRequests = [
    {
      id: 1,
      type: "Personal",
      subject: "Need headphone",
      creationDate: "2024-06-01",
      closedDate: "2024-06-05",
    },
    {
      id: 2,
      type: "Personal",
      subject: "Medicine pickup",
      creationDate: "2024-06-10",
      closedDate: null,
    },
  ];

  const othersRequests = [
    {
      id: 1,
      type: "For Others",
      subject: "Help picking up the delivery",
      creationDate: "2024-06-03",
      closedDate: null,
    },
    {
      id: 2,
      type: "For Others",
      subject: "Collect donations",
      creationDate: "2024-06-12",
      closedDate: "2024-06-15",
    },
  ];

  const managedRequests = [
    {
      id: 1,
      type: "Managed",
      subject: "Grocery Delivery",
      creationDate: "2024-06-03",
      closedDate: null,
    },
    {
      id: 2,
      type: "Managed",
      subject: "Manage donations",
      creationDate: "2024-06-12",
      closedDate: "2024-06-15",
    },
  ];

  const renderTable = (requests) => (
    <table className="requests-table">
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Request Type</th>
          <th>Subject</th>
          <th>Creation Date</th>
          <th>Closed Date</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id}>
            <td>
              <Link to={`/request/${request.id}`}>{request.id}</Link>
            </td>
            <td>{request.type}</td>
            <td>{request.subject}</td>
            <td>{request.creationDate}</td>
            <td>{request.closedDate || "Open"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const openInNewWindow = () => {
    window.open(window.location.origin + '/request', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-button-bar">
        <button className="btn btn-accent">
          <Link to="/request" className="btn-link">Create Help Request</Link>
        </button>
        <button className="btn btn-accent">Promote Yourself to Volunteer</button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === "myRequests" ? "active" : ""}`} onClick={() => setActiveTab("myRequests")}>My requests</button>
        <button className={`tab ${activeTab === "othersRequests" ? "active" : ""}`} onClick={() => setActiveTab("othersRequests")}>Others requests</button>
        <button className={`tab ${activeTab === "managedRequests" ? "active" : ""}`} onClick={() => setActiveTab("managedRequests")}>Managed requests</button>
      </div>

      {activeTab === "myRequests" && (
        <div className="requests-section">
          <h2>My Help Requests</h2> 
          {renderTable(userRequests)}
        </div>
      )}

      {activeTab === "othersRequests" && (
        <div className="requests-section">
          <h2>Requests Created for Others</h2> 
          {renderTable(othersRequests)}
        </div>
      )}

      {activeTab === "managedRequests" && (
        <div className="requests-section">
          <h2>Managed Requests</h2> 
          {renderTable(managedRequests)}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
