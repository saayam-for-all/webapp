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
            <div className="flex justify-start items-center bg-blue-200 p-4 rounded-t-lg">
                <button
                    className={`py-2 px-4 rounded-md ${isEditing ? 'bg-orange-500 text-white' : 'bg-transparent text-gray-800'}`}
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>
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
            </div>
        </div>
    );
}

export default ContactInformation;
