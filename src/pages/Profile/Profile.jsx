import React, { useState, useEffect } from 'react';
import AccountInformation from './AccountInformation';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import DEFAULT_PROFILE_ICON from "../../assets/Landingpage_images/ProfileImage.jpg";

function Profile() {
    const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
    const [activeTab, setActiveTab] = useState('photo');

    useEffect(() => {
        const savedProfilePhoto = localStorage.getItem('profilePhoto');
        if (savedProfilePhoto) {
            setProfilePhoto(savedProfilePhoto);
        }
    }, []);

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const photo = e.target.result;
                setProfilePhoto(photo);
                localStorage.setItem('profilePhoto', photo);
                window.dispatchEvent(new Event('storage')); // Trigger the storage event manually
            };
            reader.readAsDataURL(file);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'photo':
                return (
                    <div className="flex flex-col items-center p-4">
                        <img src={profilePhoto} alt="Profile" className="rounded-full w-32 h-32 mb-4" />
                        <label htmlFor="edit-photo-input" className="py-2 px-4 cursor-pointer bg-gray-200 rounded-md mb-4 flex items-center">
                            <i className="fas fa-camera mr-2"></i> Edit Photo
                        </label>
                        <input
                            type="file"
                            id="edit-photo-input"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
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
                            className={`block py-2 px-4 text-left w-full mb-2 ${activeTab === 'photo' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-800 hover:text-blue-500'}`} 
                            onClick={() => setActiveTab('photo')}
                        >
                            Profile Photo
                        </button>
                        <button 
                            className={`block py-2 px-4 text-left w-full mb-2 ${activeTab === 'account' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-800 hover:text-blue-500'}`} 
                            onClick={() => setActiveTab('account')}
                        >
                            Account Information
                        </button>
                        <button 
                            className={`block py-2 px-4 text-left w-full mb-2 ${activeTab === 'contact' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-800 hover:text-blue-500'}`} 
                            onClick={() => setActiveTab('contact')}
                        >
                            Contact Information
                        </button>
                        <button 
                            className={`block py-2 px-4 text-left w-full ${activeTab === 'personal' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-800 hover:text-blue-500'}`} 
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
