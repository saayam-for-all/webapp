import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import CountryList from "react-select-country-list";
import { FiPhoneCall } from "react-icons/fi"; 
import { FiVideo } from "react-icons/fi"; 

function YourProfile({ setHasUnsavedChanges }) {
    const [isEditing, setIsEditing] = useState(false);
    const firstNameRef = useRef(null);

    const [profileInfo, setProfileInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        phoneCountryCode: "US",
        country: "",
    });

    const countries = CountryList().getData();

    useEffect(() => {
        const savedProfileInfo = JSON.parse(localStorage.getItem("profileInfo"));
        if (savedProfileInfo) {
            setProfileInfo(savedProfileInfo);
        }
    }, []);

    const handleInputChange = (name, value) => {
        setProfileInfo({
            ...profileInfo,
            [name]: value,
        });
        setHasUnsavedChanges(true);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (firstNameRef.current) {
                firstNameRef.current.focus();
            }
        }, 0);
    };

    return (
        <div className="flex flex-col border p-6 rounded-lg w-full" data-testid="container-test-1">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4 mb-6" data-testid="container-test-2">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">First Name</label>
                    {isEditing ? (
                        <input
                            ref={firstNameRef}
                            type="text"
                            name="firstName"
                            value={profileInfo.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{profileInfo.firstName || ""}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Last Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="lastName"
                            value={profileInfo.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{profileInfo.lastName || ""}</p>
                    )}
                </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 gap-4 mb-6" data-testid="container-test-3">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={profileInfo.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{profileInfo.email || ""}</p>
                    )}
                </div>
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-1 gap-4 mb-6" data-testid="container-test-4">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Phone Number</label>
                    {isEditing ? (
                        <div className="flex space-x-2 items-center">
                            {/* Country Code Dropdown */}
                            <select
                                id="phoneCountryCode"
                                name="phoneCountryCode"
                                value={profileInfo.phoneCountryCode}
                                onChange={(e) => handleInputChange("phoneCountryCode", e.target.value)}
                                className="w-1/3 px-4 py-2 border border-gray-300 rounded-xl"
                            >
                                {getPhoneCodeslist(PHONECODESEN).map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.country} ({option.dialCode})
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={profileInfo.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="Your Phone Number"
                                maxLength={10}
                                className="w-2/3 px-4 py-2 border border-gray-300 rounded-xl"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <p className="text-lg text-gray-900">
                                {profileInfo.phoneCountryCode} {profileInfo.phone}
                            </p>
                            {/* Phone and Video Icons */}
                            <FiPhoneCall className="text-gray-500 cursor-pointer hover:text-gray-700" />
                            <FiVideo className="text-gray-500 cursor-pointer hover:text-gray-700" />
                        </div>
                    )}
                </div>
            </div>

            {/* Country */}
            <div className="grid grid-cols-1 gap-4 mb-6" data-testid="container-test-5">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Country</label>
                    {isEditing ? (
                        <select
                            id="country"
                            name="country"
                            value={profileInfo.country}
                            onChange={(e) => handleInputChange("country", e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-xl"
                        >
                            <option value="">Select your country</option>
                            {countries.map((option) => (
                                <option key={option.value} value={option.label}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-lg text-gray-900">{profileInfo.country || ""}</p>
                    )}
                </div>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-center mt-6" data-testid="container-test-6">
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
                            onClick={() => {
                                setIsEditing(false);
                                localStorage.setItem("profileInfo", JSON.stringify(profileInfo));
                                setHasUnsavedChanges(false);
                            }}
                        >
                            Save
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
