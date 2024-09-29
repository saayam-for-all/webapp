import React, { useState, useEffect } from 'react';

function YourProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileInfo, setProfileInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        zone: '',
    });

    useEffect(() => {
        const savedProfileInfo = JSON.parse(localStorage.getItem('profileInfo'));
        if (savedProfileInfo) {
            setProfileInfo(savedProfileInfo);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col border p-6 rounded-lg w-full">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                        First Name
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="firstName"
                            value={profileInfo.firstName}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{profileInfo.firstName || ''}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Last Name
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="lastName"
                            value={profileInfo.lastName}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{profileInfo.lastName || ''}</p>
                    )}
                </div>
            </div>
            <div className="mb-6">
                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Email
                </label>
                {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={profileInfo.email}
                        onChange={handleInputChange}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                ) : (
                    <p className="text-lg text-gray-900">{profileInfo.email || ''}</p>
                )}
            </div>
            <div className="mb-6">
                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Phone Number
                </label>
                {isEditing ? (
                    <input
                        type="text"
                        name="phone"
                        value={profileInfo.phone}
                        onChange={handleInputChange}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                ) : (
                    <p className="text-lg text-gray-900">{profileInfo.phone || ''}</p>
                )}
            </div>
            <div className="mb-6">
                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Zone
                </label>
                {isEditing ? (
                    <input
                        type="text"
                        name="zone"
                        value={profileInfo.zone}
                        onChange={handleInputChange}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                ) : (
                    <p className="text-lg text-gray-900">{profileInfo.zone || ''}</p>
                )}
            </div>
            <div className="flex justify-center mt-6">
                {!isEditing ? (
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                ) : (
                    <>
                        <button
                            className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                            onClick={() => {
                                setIsEditing(false);
                                localStorage.setItem('profileInfo', JSON.stringify(profileInfo));
                            }}
                        >
                            Save Changes
                        </button>
                        <button
                            className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default YourProfile;
