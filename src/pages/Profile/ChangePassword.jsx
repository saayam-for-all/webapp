import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function ChangePassword({ setHasUnsavedChanges }) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const currentPasswordRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            setHasUnsavedChanges(true);
        } else {
            setHasUnsavedChanges(false);
        }
    }, [isEditing, setHasUnsavedChanges]);

    const handleEditClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (currentPasswordRef.current) {
                currentPasswordRef.current.focus();
            }
        }, 0);
    };

    const handleSaveClick = () => {
        let valid = true;
        setErrorMessage('');
        setPasswordMatchError('');

        if (newPassword.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            valid = false;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMatchError('Passwords do not match.');
            valid = false;
        }

        if (valid) {
            setIsEditing(false);
            setHasUnsavedChanges(false); 
            alert('Password changed successfully!');
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setErrorMessage('');
        setPasswordMatchError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setHasUnsavedChanges(false); 
    };

    return (
        <div className="flex flex-col border p-6 rounded-lg w-full">
            <h3 className="font-bold text-xl mb-4">Change Password</h3>
            {isEditing ? (
                <>
                    <div className="mb-6">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                ref={currentPasswordRef}
                                type={showPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                                    errorMessage ? 'border-red-500' : 'border-gray-200'
                                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </div>
                        </div>
                        {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
                        <p className="text-xs text-gray-500">Must contain at least 8 characters.</p>
                    </div>
                    <div className="mb-6">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                                    passwordMatchError ? 'border-red-500' : 'border-gray-200'
                                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </div>
                        </div>
                        {passwordMatchError && <p className="text-red-500 text-xs mt-1">{passwordMatchError}</p>}
                    </div>
                    <div className="flex justify-center mt-6">
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
                    </div>
                </>
            ) : (
                <div className="flex justify-center">
                    <button
                        className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleEditClick}
                    >
                        Edit Password
                    </button>
                </div>
            )}
        </div>
    );
}

export default ChangePassword;
