import React, { useState, useEffect } from 'react';

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

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col border p-4 rounded-lg w-full max-w-3xl mb-8">
            <div className="flex flex-col p-4">
                <div className="flex items-center mb-4">
                    <label className="font-bold w-1/4">Username:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="username"
                            value={accountInfo.username}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md w-3/4"
                        />
                    ) : (
                        <p className="w-3/4">{accountInfo.username}</p>
                    )}
                </div>
                <div className="flex items-center mb-4">
                    <label className="font-bold w-1/4">Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={accountInfo.email}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md w-3/4"
                        />
                    ) : (
                        <p className="w-3/4">{accountInfo.email}</p>
                    )}
                </div>
                <div className="flex items-center mb-4">
                    <label className="font-bold w-1/4">Password:</label>
                    <p className="w-3/4">
                        <a href="#" className="text-red-600">Change Password</a>
                    </p>
                </div>
                <div className="flex items-center mb-4">
                    <label className="font-bold w-1/4">Phone:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="phone"
                            value={accountInfo.phone}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md w-3/4"
                        />
                    ) : (
                        <p className="w-3/4">{accountInfo.phone}</p>
                    )}
                </div>
                <div className="flex justify-center mt-4">
                    {!isEditing ? (
                        <button
                            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={handleEditClick}
                        >
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                                onClick={handleSaveClick}
                            >
                                Save
                            </button>
                            <button
                                className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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

export default AccountInformation;
