import React from 'react';
import { FaUserCircle, FaLock, FaPencilAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/authentication/authActions";

function Sidebar({ profilePhoto, userName, userEmail, handleTabChange, activeTab, openModal }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(logout());
    };

    return (
        <div className="flex flex-col justify-between h-full p-4 border-r"> {/* Full-height layout */}
            <div className="text-center">
                <div className="relative mb-4">
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="rounded-full w-24 h-24 object-cover mx-auto cursor-pointer"
                        onClick={openModal}
                    />
                    <div
                        className="absolute bottom-2 right-2 bg-white border rounded-full p-1 cursor-pointer"
                        onClick={openModal}
                    >
                        <FaPencilAlt className="text-gray-600" />
                    </div>
                </div>
                <h3 className="font-bold text-lg">{userName}</h3>
                <p className="text-gray-500">{userEmail}</p>
            </div>

            {/* Profile and other tabs */}
            <div className="mt-6">
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

            <div className="mt-8">
                <button
                    className="flex items-center justify-center w-full py-3 px-4 text-white bg-blue-500 hover:bg-blue-600 font-semibold rounded-md"
                    onClick={handleSignOut}
                >
                    <FaSignOutAlt className="mr-2 text-lg" /> Log out
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
