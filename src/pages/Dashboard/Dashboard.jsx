import React from "react";
import "./Dashboard.css";

const Dashboard = ({ t, userRole }) => {
  const userRequests = [
    { id: 1, type: "Personal", subject: "Need headphone", creationDate: "2024-06-01", closedDate: "2024-06-05" },
    { id: 2, type: "Personal", subject: "Medicine pickup", creationDate: "2024-06-10", closedDate: null },
  ];

  const othersRequests = [
    { id: 1, type: "For Others", subject: "Help picking up the delivery", creationDate: "2024-06-03", closedDate: null },
    { id: 2, type: "For Others", subject: "Collect donations", creationDate: "2024-06-12", closedDate: "2024-06-15" },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-button-bar">
        <button className="btn btn-accent">
          New Help Request
        </button>
        <button className="btn btn-accent">
          Promote to Volunteer
        </button>
      </div>

      <div className="requests-section">
        <h2>Your Help Requests</h2>
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
            {userRequests.map((request) => (
              <tr key={request.id}>
                <td><a href={`/requests/${request.id}`}>{request.id}</a></td>
                <td>{request.type}</td>
                <td>{request.subject}</td>
                <td>{request.creationDate}</td>
                <td>{request.closedDate || "Open"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="requests-section">
        <h2>Requests Created for Others</h2>
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
            {othersRequests.map((request) => (
              <tr key={request.id}>
                <td><a href={`/requests/${request.id}`}>{request.id}</a></td>
                <td>{request.type}</td>
                <td>{request.subject}</td>
                <td>{request.creationDate}</td>
                <td>{request.closedDate || "Open"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;