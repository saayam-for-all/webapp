import React from 'react';

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
                    className={`block py-2 px-4 text-left w-full mb-2 ${
                        activeTab === 'account'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                    onClick={() => handleTabChange('account')}
                >
                    Account Information
                </button>
                <button
                    className={`block py-2 px-4 text-left w-full mb-2 ${
                        activeTab === 'contact'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                    onClick={() => handleTabChange('contact')}
                >
                    Contact Information
                </button>
                <button
                    className={`block py-2 px-4 text-left w-full mb-2 ${
                        activeTab === 'personal'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                    onClick={() => handleTabChange('personal')}
                >
                    Personal Information
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
