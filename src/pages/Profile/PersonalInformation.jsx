import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const genderOptions = [
    { value: 'Woman', label: 'Woman' },
    { value: 'Man', label: 'Man' },
    { value: 'Non-binary', label: 'Non-binary' },
    { value: 'Transgender', label: 'Transgender' },
    { value: 'Intersex', label: 'Intersex' },
    { value: 'Gender-nonconforming', label: 'Gender-nonconforming' },
];

function PersonalInformation() {
    const [isEditing, setIsEditing] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        pronouns: '',
        gender: [],
        dateOfBirth: null,
        languagePreference1: '',
        languagePreference2: ''
    });

    const [languages, setLanguages] = useState([]);

    useEffect(() => {
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

        const savedPersonalInfo = JSON.parse(localStorage.getItem('personalInfo'));
        if (savedPersonalInfo) {
            setPersonalInfo({
                ...savedPersonalInfo,
                dateOfBirth: savedPersonalInfo.dateOfBirth ? new Date(savedPersonalInfo.dateOfBirth) : null
            });
        }
    }, []);

    const handleInputChange = (name, value) => {
        setPersonalInfo({
            ...personalInfo,
            [name]: value
        });
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col border p-4 rounded-lg w-full max-w-3xl mb-8">
            <div className="flex flex-col p-4">
                <div className="flex items-center mb-4">
                    <label className="font-bold w-1/4">Pronouns:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="pronouns"
                            value={personalInfo.pronouns}
                            onChange={(e) => handleInputChange('pronouns', e.target.value)}
                            className="border p-2 rounded-md w-3/4"
                        />
                    ) : (
                        <p className="w-3/4">{personalInfo.pronouns}</p>
                    )}
                </div>
                <div className="flex items-center mb-4">
                    <label className="font-bold w-1/4">Gender:</label>
                    {isEditing ? (
                        <Select
                            isMulti
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            value={genderOptions.filter(option => personalInfo.gender.includes(option.value))}
                            options={genderOptions}
                            onChange={selectedOptions => handleInputChange('gender', selectedOptions ? selectedOptions.map(option => option.value) : [])}
                            className="w-3/4"
                        />
                    ) : (
                        <p className="w-3/4">{personalInfo.gender.join(', ')}</p>
                    )}
                </div>
                <div className="flex items-center mb-4">
                    <label className="font-bold w-1/4">Date of Birth:</label>
                    {isEditing ? (
                        <DatePicker
                            selected={personalInfo.dateOfBirth}
                            onChange={date => handleInputChange('dateOfBirth', date)}
                            className="border p-2 rounded-md w-3/4"
                        />
                    ) : (
                        <p className="w-3/4">{personalInfo.dateOfBirth ? personalInfo.dateOfBirth.toLocaleDateString() : 'Not Set'}</p>
                    )}
                </div>
                <div className="flex items-center mb-4">
                    <label className="font-bold w-1/4">Language Preference 1:</label>
                    {isEditing ? (
                        <Select
                            value={{ value: personalInfo.languagePreference1, label: personalInfo.languagePreference1 }}
                            options={languages}
                            onChange={selectedOption => handleInputChange('languagePreference1', selectedOption ? selectedOption.value : '')}
                            className="w-3/4"
                        />
                    ) : (
                        <p className="w-3/4">{personalInfo.languagePreference1}</p>
                    )}
                </div>
                <div className="flex items-center mb-4">
                    <label className="font-bold w-1/4">Language Preference 2:</label>
                    {isEditing ? (
                        <Select
                            value={{ value: personalInfo.languagePreference2, label: personalInfo.languagePreference2 }}
                            options={languages}
                            onChange={selectedOption => handleInputChange('languagePreference2', selectedOption ? selectedOption.value : '')}
                            className="w-3/4"
                        />
                    ) : (
                        <p className="w-3/4">{personalInfo.languagePreference2}</p>
                    )}
                </div>
                <div className="flex justify-center mt-4">
                    {!isEditing ? (
                        <button
                            className="edit-button py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={handleEditClick}
                        >
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                className="edit-button py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                                onClick={handleSaveClick}
                            >
                                Save
                            </button>
                            <button
                                className="edit-button py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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

export default PersonalInformation;
