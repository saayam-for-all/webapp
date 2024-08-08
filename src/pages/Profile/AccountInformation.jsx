import React, { useState, useEffect } from 'react';
import './Profile.css';

function AccountInformation() {
    const [isEditing, setIsEditing] = useState(false);
    const [accountInfo, setAccountInfo] = useState({
        username: '',
        email: '',
        password: '********',
        phone: ''
    });

    useEffect(() => {
        const savedAccountInfo = JSON.parse(localStorage.getItem('accountInfo'));
        if (savedAccountInfo) {
            setAccountInfo(savedAccountInfo);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
    };

    return (
        <div className="section">
            <div className="section-header">
                <h2>Account Information</h2>
                <button className={`edit-btn ${isEditing ? 'save-btn' : ''}`} onClick={isEditing ? handleSaveClick : handleEditClick}>
                    {!isEditing && <i className="fas fa-pencil-alt edit-icon"></i>}
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>
            <div className="info-group">
                <label>Username</label>
                {isEditing ? (
                    <input 
                        type="text"
                        name="username"
                        value={accountInfo.username}
                        onChange={handleInputChange}
                        className="edit-input"
                    />
                ) : (
                    <p>{accountInfo.username}</p>
                )}
            </div>
            <div className="info-group">
                <label>Email</label>
                {isEditing ? (
                    <input 
                        type="email"
                        name="email"
                        value={accountInfo.email}
                        onChange={handleInputChange}
                        className="edit-input"
                    />
                ) : (
                    <p>{accountInfo.email}</p>
                )}
            </div>
            <div className="info-group">
                <label>Password</label>
                <p><a href="#" className="change-password-link">Change Password</a></p>
            </div>
            <div className="info-group">
                <label>Phone</label>
                {isEditing ? (
                    <input 
                        type="text"
                        name="phone"
                        value={accountInfo.phone}
                        onChange={handleInputChange}
                        className="edit-input"
                    />
                ) : (
                    <p>{accountInfo.phone}</p>
                )}
            </div>  
        </div>
    );
}

export default AccountInformation;
