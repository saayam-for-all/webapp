import avatar from "../../assets/avatar.jpg";
import React from "react"; //added for testing

const RequestDetailsSidebar = () => {
  return (
    <div className="px-4">
      <div className="py-4 border-b border-gray-200">
        <h4 className="font-semibold">Created By</h4>
        <div className="flex mt-2 items-center text-xs">
          <img
            className="mr-2 w-5 h-5 rounded-full"
            src={avatar}
            alt={"assignee"}
          />
          <p>Peter Parker</p>
        </div>
      </div>
      <div className="py-4 border-b border-gray-200">
        <h4 className="font-semibold">Assignees</h4>
        <div className="text-xs mt-2">
          <div className="flex mt-2 items-center">
            <img
              className="mr-2 w-5 h-5 rounded-full"
              src={avatar}
              alt={"assignee"}
            />
            <p>Ethan Marshall</p>
          </div>
          <div className="flex mt-2 items-center">
            <img
              className="mr-2 w-5 h-5 rounded-full"
              src={avatar}
              alt={"assignee"}
            />
            <p>Olivia Bennett</p>
          </div>
          <div className="flex mt-2 items-center">
            <img
              className="mr-2 w-5 h-5 rounded-full"
              src={avatar}
              alt={"assignee"}
            />
            <p>Mei Chen</p>
          </div>
        </div>
      </div>

      <div className="py-4 border-b border-gray-200">
        <h4 className="font-semibold mb-1">Priority</h4>
        <span className="bg-red-600 text-white text-xs font-medium px-2.5 py-0.5 mt-4 rounded-full ">
          High
        </span>
      </div>
      <div className="py-4">
        <h4 className="font-semibold mb-1">Category</h4>
        <span className="text-white bg-blue-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          Maintenance
        </span>
      </div>
    </div>
  );
};

export default RequestDetailsSidebar;
