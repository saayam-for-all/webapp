import React from 'react';

function Modal({ profilePhoto, handlePhotoChange, handleSaveClick, handleCancelClick, handleDeleteClick }) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-center">Profile Photo</h3>
                <div className="flex justify-center mb-4">
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
                    <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        Upload
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </label>
                    <button
                        onClick={handleDeleteClick}
                        className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleSaveClick}
                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancelClick}
                        className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
