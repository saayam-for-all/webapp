// src/pages/Dashboard/DashboardTable/DashboardTable.jsx
import React from "react";
import { Link } from "react-router-dom";
// import "./DashboardTable.css";

const DashboardTable = ({ requests }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creation Date</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closed Date</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {requests.map((request) => (
        <tr key={request.id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <Link to={`/request/${request.id}`} className="text-indigo-600 hover:text-indigo-900">{request.id}</Link>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">{request.type}</td>
          <td className="px-6 py-4 whitespace-nowrap">{request.subject}</td>
          <td className="px-6 py-4 whitespace-nowrap">{request.creationDate}</td>
          <td className="px-6 py-4 whitespace-nowrap">{request.closedDate || "Open"}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default DashboardTable;
