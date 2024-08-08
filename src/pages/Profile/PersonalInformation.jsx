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
]

function PersonalInformation() {
    const [isEditing, setIsEditing] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        pronouns: '',
        gender: [],
        dateOfBirth: new Date(),
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
                dateOfBirth: new Date(savedPersonalInfo.dateOfBirth)
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
        <div className="section mb-20">
            <div className="section-header">
                <h2>Personal Information</h2>
                <button 
                    className={`edit-btn ${isEditing ? 'save-btn' : ''}`} 
                    onClick={isEditing ? handleSaveClick : handleEditClick}>
                    {!isEditing && <i className="fas fa-pencil-alt edit-icon"></i>}
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>
            <div className="info-group">
                <label>What are your pronouns?</label>
                {isEditing ? (
                    <input 
                        type="text"
                        name="pronouns"
                        value={personalInfo.pronouns}
                        onChange={(e) => handleInputChange('pronouns', e.target.value)}
                        className="edit-input"
                    />
                ) : (
                    <p className="info-text">{personalInfo.pronouns}</p>
                )}
            </div>

            <div className="info-group">
                <label>Please select one or more that reflect your gender</label>
                {isEditing ? (
                    <Select 
                        isMulti
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={genderOptions.filter(option => personalInfo.gender.includes(option.value))}
                        options={genderOptions}
                        onChange={selectedOptions => handleInputChange('gender', selectedOptions ? selectedOptions.map(option => option.value) : [])}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                ) : (
                    <p className="info-text">{personalInfo.gender.join(', ')}</p>
                )}
            </div>

            <div className="info-group">
                <label>Date of Birth</label>
                {isEditing ? (
                    <DatePicker
                        selected={personalInfo.dateOfBirth}
                        onChange={date => handleInputChange('dateOfBirth', date)}
                        className="edit-input"
                    />
                ) : (
                    <p className="info-text">{personalInfo.dateOfBirth.toLocaleDateString()}</p>
                )}
            </div>

            <div className="info-group">
                <label>Language Preference 1</label>
                {isEditing ? (
                    <Select 
                        value={{ value: personalInfo.languagePreference1, label: personalInfo.languagePreference1 }}
                        options={languages}
                        onChange={selectedOption => handleInputChange('languagePreference1', selectedOption ? selectedOption.value : '')}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                ) : (
                    <p className="info-text">{personalInfo.languagePreference1}</p>
                )}
            </div>

            <div className="info-group">
                <label>Language Preference 2</label>
                {isEditing ? (
                    <Select
                        value={{ value: personalInfo.languagePreference2, label: personalInfo.languagePreference2 }}
                        options={languages}
                        onChange={selectedOption => handleInputChange('languagePreference2', selectedOption ? selectedOption.value : '')}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                ) : (
                    <p className="info-text">{personalInfo.languagePreference2}</p>
                )}
            </div>
        </div>
    );
}

export default PersonalInformation;
