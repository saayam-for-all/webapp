import React, { useState } from 'react';
import AccountInformation from './AccountInformation';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import DEFAULT_PROFILE_ICON from "../../assets/Landingpage_images/ProfileImage.jpg";

function Profile() {
    const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
    const [activeTab, setActiveTab] = useState('account');

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePhoto(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
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
        <div className="w-full flex flex-col items-center p-4">
            <div className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center border p-4 rounded-lg">
                    <img src={profilePhoto} alt="Profile" className="rounded-full w-48 h-48" />
                    <label htmlFor="edit-photo-input" className="mt-4 py-2 px-8 cursor-pointer bg-gray-200 rounded-md flex items-center">
                        <i className="fas fa-camera mr-2"></i> Edit Photo
                    </label>
                    <input
                        type="file"
                        id="edit-photo-input"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                </div>
            </div>

            <div className="flex justify-center mt-4 mb-4 space-x-4">
                <button className={`py-2 px-4 ${activeTab === 'account' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('account')}>Account Information</button>
                <button className={`py-2 px-4 ${activeTab === 'contact' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('contact')}>Contact Information</button>
                <button className={`py-2 px-4 ${activeTab === 'personal' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('personal')}>Personal Information</button>
            </div>
            {renderTabContent()}
        </div>
    );
}

export default Profile;
