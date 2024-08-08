import React, { useState } from 'react';
import AccountInformation from './AccountInformation';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import DEFAULT_PROFILE_ICON from "../../assets/Landingpage_images/ProfileImage.jpg";

import './Profile.css';

function Profile() {
    const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
    const [activeTab, setActiveTab] = useState('account')

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
                return <AccountInformation />
            case 'contact':
                return <ContactInformation />
            case 'personal':
                return <PersonalInformation />
            default:
                return null;
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-photo-section">
                    <img src={profilePhoto} alt="Profile" className="profile-photo" />
                    <label htmlFor="edit-photo-input" className="edit-photo-btn">
                        <i className="camera-icon fas fa-camera"></i> Edit Photo
                    </label>
                    <input
                        type="file"
                        id="edit-photo-input"
                        className="edit-photo-input"
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            <div className="tab-container">
                <button className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>Account Information</button>
                <button className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>Contact Information</button>
                <button className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>Personal Information</button>
            </div>
           {renderTabContent()}
        </div>
    );
}

export default Profile;