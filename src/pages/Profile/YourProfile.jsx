import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

function YourProfile({ setHasUnsavedChanges }) {
    const [isEditing, setIsEditing] = useState(false);
    const firstNameRef = useRef(null);

    const [profileInfo, setProfileInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        secondaryEmail: '',
        phone: '',
        phoneCountryCode: '',
        secondaryPhone: '',
        secondaryPhoneCountryCode: '',
        zone: '',
    });

    const [countryOptions, setCountryOptions] = useState([]);

    
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json')
            .then((response) => response.json())
            .then((data) => {
                const countries = data.map((country) => ({
                    value: country.phone_code,
                    label: `${country.name} (+${country.phone_code})`,
                }));
                setCountryOptions(countries);
            })
            .catch((error) => console.error('Error fetching country codes:', error));

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
        <div className="flex flex-col border p-6 rounded-lg w-full" data-testid='container-test-1'>
            <div className="grid grid-cols-2 gap-4 mb-6" data-testid='container-test-2'>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">First Name</label>
                    {isEditing ? (
                        <input
                            ref={firstNameRef}
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
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Last Name</label>
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

            
            <div className="grid grid-cols-2 gap-4 mb-6" data-testid='container-test-3'>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Primary Email</label>
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
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Secondary Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="secondaryEmail"
                            value={profileInfo.secondaryEmail}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{profileInfo.secondaryEmail || ''}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6" data-testid='container-test-4'>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Primary Phone Number</label>
                    {isEditing ? (
                        <div className="flex">
                            <Select
                                name="phoneCountryCode"
                                value={countryOptions.find((option) => option.value === profileInfo.phoneCountryCode)}
                                options={countryOptions}
                                onChange={(selectedOption) => handleInputChange({ target: { name: 'phoneCountryCode', value: selectedOption.value } })}
                                className="w-1/4 mr-2"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={profileInfo.phone}
                                onChange={handleInputChange}
                                className="appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            />
                        </div>
                    ) : (
                        <p className="text-lg text-gray-900">
                            {profileInfo.phoneCountryCode} {profileInfo.phone}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6" data-testid='container-test-5'>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Secondary Phone Number</label>
                    {isEditing ? (
                        <div className="flex">
                            <Select
                                name="secondaryPhoneCountryCode"
                                value={countryOptions.find((option) => option.value === profileInfo.secondaryPhoneCountryCode)}
                                options={countryOptions}
                                onChange={(selectedOption) => handleInputChange({ target: { name: 'secondaryPhoneCountryCode', value: selectedOption.value } })}
                                className="w-1/4 mr-2"
                            />
                            <input
                                type="text"
                                name="secondaryPhone"
                                value={profileInfo.secondaryPhone}
                                onChange={handleInputChange}
                                className="appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            />
                        </div>
                    ) : (
                        <p className="text-lg text-gray-900">
                            {profileInfo.secondaryPhoneCountryCode} {profileInfo.secondaryPhone}
                        </p>
                    )}
                </div>
            </div>

            <div className="mb-6" data-testid='container-test-6'>
                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Zone</label>
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

            <div className="flex justify-center mt-6" data-testid='container-test-7'>
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
                                localStorage.setItem('profileInfo', JSON.stringify(profileInfo));
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
