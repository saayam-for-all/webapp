import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HelpRequestForm = () => {
  const [categories, setCategories] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    requestType: '',
    isCalamity: false,
    priority: '',
    description: '',
    isForSelf: true,
    otherPerson: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      sex: '',
      age: '',
      languagePreferences: '',
    },
  });

  useEffect(() => {
    // Fetch enums
    axios.get('/api/help-request-categories').then(response => {
      setCategories(response.data);
    });
    axios.get('/api/help-request-types').then(response => {
      setRequestTypes(response.data);
    });
    axios.get('/api/help-request-priorities').then(response => {
      setPriorities(response.data);
    });
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name.startsWith('otherPerson.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        otherPerson: {
          ...formData.otherPerson,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Post the form data to your database
    axios.post('/api/help-requests', formData)
      .then(response => {
        // Handle success
        console.log('Help request created:', response.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error creating help request:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Request Type:
          <select name="requestType" value={formData.requestType} onChange={handleChange}>
            {requestTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Is Calamity:
          <input
            type="checkbox"
            name="isCalamity"
            checked={formData.isCalamity}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <label>
          Priority:
          <select name="priority" value={formData.priority} onChange={handleChange}>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <label>
          Is for Self:
          <input
            type="checkbox"
            name="isForSelf"
            checked={formData.isForSelf}
            onChange={handleChange}
          />
        </label>
      </div>

      {!formData.isForSelf && (
        <div>
          <label>
            First Name:
            <input
              type="text"
              name="otherPerson.firstName"
              value={formData.otherPerson.firstName}
              onChange={handleChange}
            />
          </label>

          <label>
            Last Name:
            <input
              type="text"
              name="otherPerson.lastName"
              value={formData.otherPerson.lastName}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone Number:
            <input
              type="text"
              name="otherPerson.phoneNumber"
              value={formData.otherPerson.phoneNumber}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="otherPerson.email"
              value={formData.otherPerson.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Sex:
            <input
              type="text"
              name="otherPerson.sex"
              value={formData.otherPerson.sex}
              onChange={handleChange}
            />
          </label>

          <label>
            Age:
            <input
              type="number"
              name="otherPerson.age"
              value={formData.otherPerson.age}
              onChange={handleChange}
            />
          </label>

          <label>
            Language Preferences:
            <input
              type="text"
              name="otherPerson.languagePreferences"
              value={formData.otherPerson.languagePreferences}
              onChange={handleChange}
            />
          </label>
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};

export default HelpRequestForm;
