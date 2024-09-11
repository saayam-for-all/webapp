import React from 'react';
import { FaUserCircle, FaLock } from 'react-icons/fa';

function Sidebar({ profilePhoto, userName, userEmail, handleTabChange, activeTab, openModal }) {
    return (
        <div className="w-1/4 flex flex-col items-center p-4 border-r">
            <div className="mt-6 w-full text-center">
                <div className="relative mb-4">
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="rounded-full w-24 h-24 object-cover mx-auto cursor-pointer"
                        onClick={openModal}
                    />
                </div>
                <h3 className="font-bold text-lg">{userName}</h3>
                <p className="text-gray-500">{userEmail}</p>
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="mt-6 w-full">
                <button
                    className={`flex items-center py-2 px-4 text-left w-full mb-2 ${
                        activeTab === 'profile'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                    onClick={() => handleTabChange('profile')}
                >
                    <FaUserCircle className="mr-2" /> Your Profile
                </button>
                <button
                    className={`flex items-center py-2 px-4 text-left w-full mb-2 ${
                        activeTab === 'personal'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                    onClick={() => handleTabChange('personal')}
                >
                    <FaUserCircle className="mr-2" /> Personal Information
                </button>
                <button
                    className={`flex items-center py-2 px-4 text-left w-full mb-2 ${
                        activeTab === 'password'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                    onClick={() => handleTabChange('password')}
                >
                    <FaLock className="mr-2" /> Change Password
                </button>
                <button
                    className={`flex items-center py-2 px-4 text-left w-full mb-2 ${
                        activeTab === 'organization'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                    onClick={() => handleTabChange('organization')}
                >
                    <FaUserCircle className="mr-2" /> Organization Details
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
