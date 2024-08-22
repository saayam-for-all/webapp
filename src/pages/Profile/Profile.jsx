import React, { useState, useEffect } from 'react';
import AccountInformation from './AccountInformation';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import DEFAULT_PROFILE_ICON from "../../assets/Landingpage_images/ProfileImage.jpg";

function Profile() {
    const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
    const [tempProfilePhoto, setTempProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
    const [activeTab, setActiveTab] = useState('photo');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const savedProfilePhoto = localStorage.getItem('profilePhoto');
        if (savedProfilePhoto) {
            setProfilePhoto(savedProfilePhoto);
            setTempProfilePhoto(savedProfilePhoto);
        }
    }, []);

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const photo = e.target.result;
                setTempProfilePhoto(photo);
                setIsEditing(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveClick = () => {
        setProfilePhoto(tempProfilePhoto);
        localStorage.setItem('profilePhoto', tempProfilePhoto);
        window.dispatchEvent(new Event('profile-photo-updated'));
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setTempProfilePhoto(profilePhoto);
        setIsEditing(false);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'photo':
                return (
                    <div className="flex flex-col items-center p-4">
                        <img src={tempProfilePhoto} alt="Profile" className="rounded-full w-32 h-32 mb-4" />
                        <label htmlFor="edit-photo-input" className="py-2 px-4 cursor-pointer bg-gray-200 rounded-md mb-4 flex items-center">
                            <i className="fas fa-camera mr-2"></i> Edit Photo
                        </label>
                        <input
                            type="file"
                            id="edit-photo-input"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                        {isEditing && (
                            <div className="flex justify-center space-x-4 w-full mt-4">
                                <button
                                    onClick={handleSaveClick}
                                    className="edit-button py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelClick}
                                    className="edit-button py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'account':
                return <AccountInformation />;
            case 'contact':
                return <ContactInformation />;
            case 'personal':
                return <PersonalInformation />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
            <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg">
                <div className="w-1/4 flex flex-col items-center p-4 border-r">
                    <div className="mt-6 w-full">
                        <button
                            className={`block py-2 px-4 text-left w-full mb-2 ${
                                activeTab === 'photo'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                            }`}
                            onClick={() => setActiveTab('photo')}
                        >
                            Profile Photo
                        </button>
                        <button
                            className={`block py-2 px-4 text-left w-full mb-2 ${
                                activeTab === 'account'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                            }`}
                            onClick={() => setActiveTab('account')}
                        >
                            Account Information
                        </button>
                        <button
                            className={`block py-2 px-4 text-left w-full mb-2 ${
                                activeTab === 'contact'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                            }`}
                            onClick={() => setActiveTab('contact')}
                        >
                            Contact Information
                        </button>
                        <button
                            className={`block py-2 px-4 text-left w-full ${
                                activeTab === 'personal'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                            }`}
                            onClick={() => setActiveTab('personal')}
                        >
                            Personal Information
                        </button>
                    </div>
                </div>
                <div className="w-3/4 p-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}

export default Profile;
