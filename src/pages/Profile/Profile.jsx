import React, { useState, useEffect } from 'react';
import YourProfile from './YourProfile';
import PersonalInformation from './PersonalInformation';
import ChangePassword from './ChangePassword';
import Sidebar from './Sidebar';  
import Modal from './Modal';
import DEFAULT_PROFILE_ICON from "../../assets/Landingpage_images/ProfileImage.jpg";

function Profile() {
    const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
    const [tempProfilePhoto, setTempProfilePhoto] = useState(DEFAULT_PROFILE_ICON); 
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(false);
    };

    const handleCancelClick = () => {
        setTempProfilePhoto(profilePhoto); 
        setIsEditing(false);
        setIsModalOpen(false);
    };

    const handleDeleteClick = () => {
        setTempProfilePhoto(DEFAULT_PROFILE_ICON); 
        setIsEditing(true);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <YourProfile />;
            case 'personal':
                return <PersonalInformation />;
            case 'password': 
                return <ChangePassword />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
            <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg">
                <Sidebar
                    profilePhoto={profilePhoto} 
                    handleTabChange={handleTabChange}
                    activeTab={activeTab}
                    openModal={openModal}
                />
                <div className="w-3/4 p-6">
                    {renderTabContent()}
                </div>
            </div>
            {isModalOpen && (
                <Modal 
                    profilePhoto={tempProfilePhoto} 
                    handlePhotoChange={handlePhotoChange}
                    handleSaveClick={handleSaveClick}
                    handleCancelClick={handleCancelClick}
                    handleDeleteClick={handleDeleteClick}
                />
            )}
        </div>
    );
}

export default Profile;