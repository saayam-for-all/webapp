import React, { useState, useEffect } from 'react';

function OrganizationDetails() {
    const [isEditing, setIsEditing] = useState(false);
    const [organizationInfo, setOrganizationInfo] = useState({
        organizationName: '',
        phoneNumber: '',
        email: '',
        url: '',
        streetAddress: '',
        streetAddress2: '',
        city: '',
        state: '',
        zipCode: '',
    });

    useEffect(() => {
        const savedOrganizationInfo = JSON.parse(localStorage.getItem('organizationInfo'));
        if (savedOrganizationInfo) {
            setOrganizationInfo(savedOrganizationInfo);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrganizationInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        localStorage.setItem('organizationInfo', JSON.stringify(organizationInfo));
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col p-8 rounded-lg w-full max-w-4xl mb-8 bg-white shadow-md">
            {/* Organization Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Organization Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="organizationName"
                            value={organizationInfo.organizationName}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.organizationName || 'Not Set'}</p>
                    )}
                </div>
            </div>


            {/* Phone Number, Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Phone Number</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="phoneNumber"
                            value={organizationInfo.phoneNumber}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.phoneNumber || 'Not Set'}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={organizationInfo.email}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.email || 'Not Set'}</p>
                    )}
                </div>
            </div>

            {/* URL (separate row for better alignment) */}
            <div className="grid grid-cols-1 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">URL</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="url"
                            value={organizationInfo.url}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.url || 'Not Set'}</p>
                    )}
                </div>
            </div>

            {/* Street Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Street Address</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="streetAddress"
                            value={organizationInfo.streetAddress}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.streetAddress || 'Not Set'}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Street Address 2</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="streetAddress2"
                            value={organizationInfo.streetAddress2}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.streetAddress2 || 'Not Set'}</p>
                    )}
                </div>
            </div>

            {/* City, State, Zip Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">City</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="city"
                            value={organizationInfo.city}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.city || 'Not Set'}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">State</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="state"
                            value={organizationInfo.state}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.state || 'Not Set'}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Zip Code</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="zipCode"
                            value={organizationInfo.zipCode}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.zipCode || 'Not Set'}</p>
                    )}
                </div>
            </div>

            {/* Edit, Save, Cancel Buttons */}
            <div className="flex justify-center mt-6">
                {!isEditing ? (
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleEditClick}
                    >
                        Edit
                    </button>
                ) : (
                    <>
                        <button
                            className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                            onClick={handleSaveClick}
                        >
                            Save Changes
                        </button>
                        <button
                            className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            onClick={handleCancelClick}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrganizationDetails;
