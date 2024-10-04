import React from 'react';
import { FaCamera, FaTrashAlt } from 'react-icons/fa';

function Modal({ profilePhoto, handlePhotoChange, handleSaveClick, handleCancelClick, handleDeleteClick }) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg w-96 shadow-lg relative">
                <h3 className="text-lg font-bold mb-4 text-center text-white">Profile Photo</h3>

                {/* Display profile photo or placeholder */}
                <div className="relative mb-8 flex justify-center">
                    {profilePhoto ? (
                        <img
                            src={profilePhoto}
                            alt="Profile"
                            className="rounded-full w-32 h-32 object-cover"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                            <p className="text-gray-400">No Photo</p>
                        </div>
                    )}
                </div>

                {/* Buttons with icons */}
                <div className="flex justify-between items-center mb-8 px-8">
                    <label className="flex flex-col items-center cursor-pointer">
                        <FaCamera className="text-3xl text-white mb-1" />
                        <span className="text-blue-400">Add Photo</span>
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
                        <FaTrashAlt className="text-3xl mb-1" />
                        <span>Delete</span>
                    </button>
                </div>

                <div className="flex justify-center space-x-6 mt-6">
                    <button
                        onClick={handleSaveClick}
                        className="py-2 px-6 bg-blue-500 text-white text-lg rounded-md hover:bg-blue-600"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancelClick}
                        className="py-2 px-6 bg-gray-500 text-white text-lg rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>

                {/* Optional Close Button */}
                <div className="absolute top-2 right-2 cursor-pointer text-gray-600" onClick={handleCancelClick}>
                    &times;
                </div>
            </div>
        </div>
    );
}

export default Modal;
