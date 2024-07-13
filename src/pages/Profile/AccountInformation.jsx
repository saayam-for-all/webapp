import React from 'react';

import './Profile.css';

function AccountInformation() {
    return (
        <div className="section">
            <div className="section-header">
                <h2>Account Information</h2>
                <button className="edit-btn"><i className="fas fa-pencil-alt edit-icon"></i> Edit</button>
            </div>
            <div className="info-group">
                <label>Username</label>
                <p>dikshitakejriwal</p>
            </div>
            <div className="info-group">
                <label>Email</label>
                <p>dikshita.kejriwal@gmail.com</p>
            </div>
            <div className="info-group">
                <label>Password</label>
                <p><a href="#" className="change-password-link">Change Password</a></p>
            </div>
            <div className="info-group">
                <label>Phone</label>
                <p>+1 8149762347</p>
            </div>  
        </div>
    )
}

export default AccountInformation;