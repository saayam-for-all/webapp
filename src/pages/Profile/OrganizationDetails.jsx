import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

const COUNTRY_CODE_API = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json';

function OrganizationDetails({ setHasUnsavedChanges }) {
    const [isEditing, setIsEditing] = useState(false);
    const organizationNameRef = useRef(null);

    const [organizationInfo, setOrganizationInfo] = useState({
        organizationName: '',
        phoneNumber: '',
        phoneCountryCode: '',
        email: '',
        url: '',
        streetAddress: '',
        streetAddress2: '',
        city: '',
        state: '',
        zipCode: '',
        organizationType: 'Non-Profit',
    });

    const [countryOptions, setCountryOptions] = useState([]);

    useEffect(() => {
        fetch(COUNTRY_CODE_API)
            .then((response) => response.json())
            .then((data) => {
                const countries = data.map((country) => ({
                    value: country.phone_code,
                    label: `${country.name} (+${country.phone_code})`,
                }));

                const sortedCountries = countries.sort((a, b) => {
                    if (a.label.includes('United States')) return -1;
                    if (a.label.includes('Canada')) return -1;
                    return 0;
                });

                setCountryOptions(sortedCountries);
            })
            .catch((error) => console.error('Error fetching country codes:', error));

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
        setHasUnsavedChanges(true);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (organizationNameRef.current) {
                organizationNameRef.current.focus();
            }
        }, 0);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        localStorage.setItem('organizationInfo', JSON.stringify(organizationInfo));
        setHasUnsavedChanges(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col p-8 rounded-lg w-full max-w-4xl mb-8 bg-white shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Organization Name</label>
                    {isEditing ? (
                        <input
                            ref={organizationNameRef}
                            type="text"
                            name="organizationName"
                            value={organizationInfo.organizationName}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.organizationName || ''}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Organization Type</label>
                    {isEditing ? (
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="organizationType"
                                    value="Non-Profit"
                                    checked={organizationInfo.organizationType === "Non-Profit"}
                                    onChange={handleInputChange}
                                    className="form-radio h-4 w-4 text-blue-500"
                                />
                                <span className="ml-2">Non-Profit</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    name="organizationType"
                                    value="For-Profit"
                                    checked={organizationInfo.organizationType === "For-Profit"}
                                    onChange={handleInputChange}
                                    className="form-radio h-4 w-4 text-blue-500"
                                />
                                <span className="ml-2">For-Profit</span>
                            </label>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-900">{organizationInfo.organizationType}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Phone Number</label>
                    {isEditing ? (
                        <div className="flex">
                            <Select
                                name="phoneCountryCode"
                                value={countryOptions.find(option => option.value === organizationInfo.phoneCountryCode)}
                                options={countryOptions}
                                onChange={(selectedOption) => handleInputChange({ target: { name: 'phoneCountryCode', value: selectedOption.value } })}
                                className="w-1/3 mr-2"
                            />
                            <input
                                type="text"
                                name="phoneNumber"
                                value={organizationInfo.phoneNumber}
                                onChange={handleInputChange}
                                className="appearance-none block w-2/3 bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            />
                        </div>
                    ) : (
                        <p className="text-lg text-gray-900">
                            {organizationInfo.phoneCountryCode} {organizationInfo.phoneNumber || ''}
                        </p>
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
                        <p className="text-lg text-gray-900">{organizationInfo.email || ''}</p>
                    )}
                </div>
            </div>

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
                        <p className="text-lg text-gray-900">{organizationInfo.url || ''}</p>
                    )}
                </div>
            </div>

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
                        <p className="text-lg text-gray-900">{organizationInfo.streetAddress || ''}</p>
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
                        <p className="text-lg text-gray-900">{organizationInfo.streetAddress2 || ''}</p>
                    )}
                </div>
            </div>

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
                        <p className="text-lg text-gray-900">{organizationInfo.city || ''}</p>
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
                        <p className="text-lg text-gray-900">{organizationInfo.state || ''}</p>
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
                        <p className="text-lg text-gray-900">{organizationInfo.zipCode || ''}</p>
                    )}
                </div>
            </div>

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
