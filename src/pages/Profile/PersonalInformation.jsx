import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

const genderOptions = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
    { value: 'Non-binary', label: 'Non-binary' },
    { value: 'Transgender', label: 'Transgender' },
    { value: 'Intersex', label: 'Intersex' },
    { value: 'Gender-nonconforming', label: 'Gender-nonconforming' },
];

function PersonalInformation({ setHasUnsavedChanges }) {
    const [isEditing, setIsEditing] = useState(false);
    const streetAddressRef = useRef(null);

    const [personalInfo, setPersonalInfo] = useState({
        dateOfBirth: null,
        gender: '',
        streetAddress: '',
        streetAddress2: '',
        country: '',
        state: '',
        zipCode: '',
        languagePreference1: '',
        languagePreference2: '',
        languagePreference3: '',
    });

    const [countries, setCountries] = useState([]);
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        const savedPersonalInfo = JSON.parse(localStorage.getItem('personalInfo'));
        if (savedPersonalInfo) {
            setPersonalInfo({
                ...savedPersonalInfo,
                dateOfBirth: savedPersonalInfo.dateOfBirth ? new Date(savedPersonalInfo.dateOfBirth) : null,
            });
        }

        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryList = data.map(country => ({
                    value: country.name.common,
                    label: country.name.common,
                }));
                setCountries(countryList);
            });

        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const languageSet = new Set();
                data.forEach(country => {
                    if (country.languages) {
                        Object.values(country.languages).forEach(language => languageSet.add(language));
                    }
                });
                setLanguages([...languageSet].map(lang => ({ value: lang, label: lang })));
            });
    }, []);

    const handleInputChange = (name, value) => {
        setPersonalInfo({
            ...personalInfo,
            [name]: value,
        });
        setHasUnsavedChanges(true); 
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (streetAddressRef.current) {
                streetAddressRef.current.focus(); 
            }
        }, 0);
    };

    return (
        <div className="flex flex-col p-4 rounded-lg w-full max-w-4xl mb-8 bg-white shadow-md">
            <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Date of Birth</label>
                    {isEditing ? (
                        <DatePicker
                            selected={personalInfo.dateOfBirth}
                            onChange={date => handleInputChange('dateOfBirth', date)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.dateOfBirth ? personalInfo.dateOfBirth.toLocaleDateString() : ''}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Gender</label>
                    {isEditing ? (
                        <Select
                            value={genderOptions.find(option => option.value === personalInfo.gender)}
                            options={genderOptions}
                            onChange={selectedOption => handleInputChange('gender', selectedOption ? selectedOption.value : '')}
                            className="w-full"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.gender || ''}</p>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Street Address</label>
                    {isEditing ? (
                        <input
                            ref={streetAddressRef}
                            type="text"
                            name="streetAddress"
                            value={personalInfo.streetAddress}
                            onChange={e => handleInputChange('streetAddress', e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.streetAddress || ''}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Street Address 2</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="streetAddress2"
                            value={personalInfo.streetAddress2}
                            onChange={e => handleInputChange('streetAddress2', e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.streetAddress2 || ''}</p>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Country</label>
                    {isEditing ? (
                        <Select
                            value={countries.find(option => option.value === personalInfo.country)}
                            options={countries}
                            onChange={selectedOption => handleInputChange('country', selectedOption ? selectedOption.value : '')}
                            className="w-full"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.country || ''}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">State</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="state"
                            value={personalInfo.state}
                            onChange={e => handleInputChange('state', e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.state || ''}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Zip Code</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="zipCode"
                            value={personalInfo.zipCode}
                            onChange={e => handleInputChange('zipCode', e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.zipCode || ''}</p>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mb-6">
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">First Language Preference</label>
                    {isEditing ? (
                        <Select
                            value={languages.find(option => option.value === personalInfo.languagePreference1)}
                            options={languages}
                            onChange={selectedOption => handleInputChange('languagePreference1', selectedOption ? selectedOption.value : '')}
                            className="w-full"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.languagePreference1 || ''}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Second Language Preference</label>
                    {isEditing ? (
                        <Select
                            value={languages.find(option => option.value === personalInfo.languagePreference2)}
                            options={languages}
                            onChange={selectedOption => handleInputChange('languagePreference2', selectedOption ? selectedOption.value : '')}
                            className="w-full"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.languagePreference2 || ''}</p>
                    )}
                </div>
                <div>
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">Third Language Preference</label>
                    {isEditing ? (
                        <Select
                            value={languages.find(option => option.value === personalInfo.languagePreference3)}
                            options={languages}
                            onChange={selectedOption => handleInputChange('languagePreference3', selectedOption ? selectedOption.value : '')}
                            className="w-full"
                        />
                    ) : (
                        <p className="text-lg text-gray-900">{personalInfo.languagePreference3 || ''}</p>
                    )}
                </div>
            </div>
            
            <div className="flex justify-center mt-6">
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
                            onClick={() => {
                                setIsEditing(false);
                                localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
                                setHasUnsavedChanges(false); // Reset unsaved changes after saving
                            }}
                        >
                            Save 
                        </button>
                        <button
                            className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default PersonalInformation;
