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

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const formatLabel = (key) => {
        return key
            .split(/(?=[A-Z])/)
            .join(' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/\b\w/g, char => char.toUpperCase())
            + ':';
    };

    return (
        <div className="flex flex-col border p-4 rounded-lg w-full max-w-3xl mb-8">
            <div className="flex flex-col p-4">
                {Object.keys(contactInfo).map((key) => (
                    <div className="flex items-center mb-4" key={key}>
                        <label className="font-bold w-1/4">{formatLabel(key)}</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name={key}
                                value={contactInfo[key]}
                                onChange={handleInputChange}
                                className="border p-2 rounded-md w-3/4"
                            />
                        ) : (
                            <p className="w-3/4">{contactInfo[key]}</p>
                        )}
                    </div>
                ))}
                <div className="flex justify-center mt-4">
                    {!isEditing ? (
                        <button
                            className="edit-button py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={handleEditClick}
                        >
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                className="edit-button py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                                onClick={handleSaveClick}
                            >
                                Save
                            </button>
                            <button
                                className="edit-button py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContactInformation;
