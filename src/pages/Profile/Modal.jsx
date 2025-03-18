import React from "react";
import { FaCamera, FaSave, FaTimes, FaTrashAlt } from "react-icons/fa";

function Modal({
  profilePhoto,
  handlePhotoChange,
  handleSaveClick,
  handleCancelClick,
  handleDeleteClick,
}) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
        <h3 className="text-lg font-bold mb-4 text-center">Profile Photo</h3>

        <div className="relative mb-4 flex justify-center">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              No Photo
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <label className="flex flex-col items-center cursor-pointer">
            <FaCamera className="text-2xl text-gray-600" />
            <span className="text-blue-600">Upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>

          <button
            onClick={handleDeleteClick}
            className="flex flex-col items-center text-red-500"
          >
            <FaTrashAlt className="text-2xl" />
            <span>Delete</span>
          </button>
        </div>

        <div className="flex justify-center space-x-6 mt-4">
          <button
            onClick={handleSaveClick}
            className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <FaSave />
            <span>Save</span>
          </button>
          <button
            onClick={handleCancelClick}
            className="flex items-center space-x-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            <FaTimes />
            <span>Cancel</span>
          </button>
        </div>

        <div
          className="absolute top-2 right-2 cursor-pointer text-gray-600"
          onClick={handleCancelClick}
        >
          &times;
        </div>
      </div>
    </div>
  );
}

export default Modal;
