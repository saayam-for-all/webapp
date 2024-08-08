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

    return (
        <div className="flex flex-col border p-4 rounded-lg w-full max-w-3xl mb-8">
            <div className="flex justify-between items-center bg-blue-200 p-4 rounded-t-lg">
                <h2 className="text-lg font-bold">Personal Information</h2>
                <button
                    className={`py-2 px-4 rounded-md ${isEditing ? 'bg-orange-500 text-white' : 'bg-transparent text-gray-800'}`}
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>
            <div className="flex flex-col p-4">
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">What are your pronouns?</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="pronouns"
                            value={personalInfo.pronouns}
                            onChange={(e) => handleInputChange('pronouns', e.target.value)}
                            className="border p-2 rounded-md"
                        />
                    ) : (
                        <p>{personalInfo.pronouns}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Please select one or more that reflect your gender</label>
                    {isEditing ? (
                        <Select
                            isMulti
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            value={genderOptions.filter(option => personalInfo.gender.includes(option.value))}
                            options={genderOptions}
                            onChange={selectedOptions => handleInputChange('gender', selectedOptions ? selectedOptions.map(option => option.value) : [])}
                            className="w-full"
                        />
                    ) : (
                        <p>{personalInfo.gender.join(', ')}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Date of Birth</label>
                    {isEditing ? (
                        <DatePicker
                            selected={personalInfo.dateOfBirth}
                            onChange={date => handleInputChange('dateOfBirth', date)}
                            className="border p-2 rounded-md w-full"
                        />
                    ) : (
                        <p>{personalInfo.dateOfBirth ? personalInfo.dateOfBirth.toLocaleDateString() : 'Not Set'}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Language Preference 1</label>
                    {isEditing ? (
                        <Select
                            value={{ value: personalInfo.languagePreference1, label: personalInfo.languagePreference1 }}
                            options={languages}
                            onChange={selectedOption => handleInputChange('languagePreference1', selectedOption ? selectedOption.value : '')}
                            className="w-full"
                        />
                    ) : (
                        <p>{personalInfo.languagePreference1}</p>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2">Language Preference 2</label>
                    {isEditing ? (
                        <Select
                            value={{ value: personalInfo.languagePreference2, label: personalInfo.languagePreference2 }}
                            options={languages}
                            onChange={selectedOption => handleInputChange('languagePreference2', selectedOption ? selectedOption.value : '')}
                            className="w-full"
                        />
                    ) : (
                        <p>{personalInfo.languagePreference2}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PersonalInformation;
