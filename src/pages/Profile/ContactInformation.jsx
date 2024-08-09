import React, { useState, useEffect } from 'react';

function ContactInformation() {
    const [isEditing, setIsEditing] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        firstName: '',
        lastName: '',
        preferredName: '',
        phoneticPronunciation: '',
        streetAddress: '',
        currentCity: '',
        currentState: '',
        currentCountry: '',
        zipCode: '',
        timeZone: ''
    });

    useEffect(() => {
        const savedContactInfo = JSON.parse(localStorage.getItem('contactInfo'));
        if (savedContactInfo) {
            setContactInfo(savedContactInfo);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    };

    return (
        <div className="flex flex-col border p-4 rounded-lg w-full max-w-3xl mb-8">
            <div className="flex justify-start items-center bg-blue-200 p-4 rounded-t-lg">
                <button
                    className={`py-2 px-4 rounded-md ${isEditing ? 'bg-orange-500 text-white' : 'bg-transparent text-gray-800'}`}
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>
            <div className="flex flex-col p-4">
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">First Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="firstName"
                            value={contactInfo.firstName}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.firstName}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Last Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="lastName"
                            value={contactInfo.lastName}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.lastName}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Preferred Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="preferredName"
                            value={contactInfo.preferredName}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.preferredName}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Phonetic Pronunciation</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="phoneticPronunciation"
                            value={contactInfo.phoneticPronunciation}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.phoneticPronunciation}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Street Address</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="streetAddress"
                            value={contactInfo.streetAddress}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.streetAddress}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Current City</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="currentCity"
                            value={contactInfo.currentCity}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.currentCity}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Current State</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="currentState"
                            value={contactInfo.currentState}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.currentState}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Current Country</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="currentCountry"
                            value={contactInfo.currentCountry}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.currentCountry}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Zip Code</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="zipCode"
                            value={contactInfo.zipCode}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.zipCode}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Time Zone</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="timeZone"
                            value={contactInfo.timeZone}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{contactInfo.timeZone}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContactInformation;
