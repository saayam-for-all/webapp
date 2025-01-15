import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loadCategories } from '../../redux/features/help_request/requestActions';
import JobsCategory from "./Categories/JobCategory";
import HousingCategory from "./Categories/HousingCategory";
import { IoMdInformationCircle } from "react-icons/io";
import usePlacesSearchBox from "./location/usePlacesSearchBox";
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import axios from 'axios';
import React from 'react' //added for testing
import { useNavigate } from "react-router";

const genderOptions = [
  { value: 'Select', label: 'Select' },
  { value: 'Woman', label: 'Woman' },
  { value: 'Man', label: 'Man' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Transgender', label: 'Transgender' },
  { value: 'Intersex', label: 'Intersex' },
  { value: 'Gender-nonconforming', label: 'Gender-nonconforming' },
];

const HelpRequestForm = ({isEdit = false, onClose}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.request);
  const token = useSelector((state) => state.auth.idToken);
  const [location, setLocation] = useState('');
  const { inputRef, isLoaded, handleOnPlacesChanged } = usePlacesSearchBox(setLocation);

  const [selfFlag, setSelfFlag] = useState(true);
  const [languages, setLanguages] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [filteredCategories, setFilteredCategories] = useState([]); 
  const [searchInput, setSearchInput] = useState(''); 
  const [requestType, setRequestType] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputref = useRef(null);
  
  const [formData, setFormData] = useState({
    is_self: "yes",
    requester_first_name: "",
    requester_last_name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Select",
    preferred_language: "",
    category: "General",
    request_type: "remote",
    location: "",
    subject: "",
    description: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
 };

 const closeForm = () => {
  navigate("/dashboard");
 }
 //console.log(token);
 const handleSubmit = async (e) => {
  e.preventDefault();

  const submissionData = {
    ...formData,
    location,
  };

  try {
    const response = await axios.post(
      "https://a9g3p46u59.execute-api.us-east-1.amazonaws.com/saayam/dev/requests/v0.0.1/help-request",
      submissionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    alert("Request submitted successfully! Request ID: " + response.data.requestId);
  } catch (error) {
    console.error("Failed to submit request:", error);
    alert("Failed to submit request!");
  }
};
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const languageSet = new Set();
        data.forEach(country => {
          if (country.languages) {
            Object.values(country.languages).forEach(language => languageSet.add(language));
          }
        });
        setLanguages([...languageSet].map(lang => ({ value: lang, label: lang })));
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    dispatch(loadCategories());
    fetchLanguages();

  }, [dispatch]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setFilteredCategories(categories); 
    }
  }, [categories]);

  const handleSearchInput = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);
    setFormData({
      ...formData,
      category: searchTerm
  });
  
    if (searchTerm.trim() === '') {

      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().startsWith(searchTerm.toLowerCase()) 
      );
      setFilteredCategories(filtered);
    }
    setShowDropdown(true);  
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && inputRef.current.getPlaces) {
      const inputNode = inputRef.current.input; 
      if (inputNode && !inputNode.contains(event.target)) {
        setShowDropdown(false);
      }
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (categoryName) => {
   // setSelectedCategory(categoryName);
    //setSearchInput(categoryName); 
    setFormData({
      ...formData,
      category: categoryName 
    });
    setShowDropdown(false); 
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = (subcategoryName) => {
   // setSelectedCategory(subcategoryName); 
    //setSearchInput(subcategoryName); 
    setFormData({
      ...formData,
      category: subcategoryName 
    });
    setShowDropdown(false); 
    setHoveredCategory(null); 
  };

  const handleForSelfFlag = (e) => {
    setSelfFlag(e.target.value === "yes");
  };
  
  return (
    <div className="">
      <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h1 className="text-2xl font-bold text-gray-800 ">{isEdit ? "Edit" : "Create"} Help Request</h1>

          <div className="flex items-start gap-2 p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50" role="alert">
            <IoMdInformationCircle size={22} />
            <div>
              <span className="font-medium">Note:</span> We do not handle life-threatening emergency requests. Please call your local emergency service if you need urgent help.
            </div>
          </div>

          <div className="mt-3" data-testid = 'parentDivOne'>
            <label htmlFor="self" className="block mb-1 text-gray-700 font-medium">
              For Self
            </label>
            <select
              id="self"
              className="border border-gray-300 text-gray-700 rounded-lg p-2 w-24"
              onChange={handleForSelfFlag}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {!selfFlag && (
            <div className="mt-3" data-testid = 'parentDivTwo'>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="requester_first_name" className="block text-gray-700 mb-1 font-medium">
                    First Name
                  </label>
                  <input type="text" id="requester_first_name" value={formData.requester_first_name} onChange={handleChange} className="w-full rounded-lg border py-2 px-3" />
                </div>
                <div>
                  <label htmlFor="requester_last_name" className="block text-gray-700 mb-1 font-medium">
                    Last Name
                  </label>
                  <input type="text" id="requester_last_name" value={formData.requester_last_name} onChange={handleChange} className="w-full rounded-lg border py-2 px-3" />
                </div>
              </div>

              <div className="mt-3" data-testid = 'parentDivThree'>
                <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">
                  Email
                </label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border py-2 px-3" />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-1 font-medium">
                    Phone
                  </label>
                  <input type="text" id="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border py-2 px-3" />
                </div>
                <div>
                  <label htmlFor="age" className="block text-gray-700 mb-1 font-medium">
                    Age
                  </label>
                  <input type="number" id="age" value={formData.age} onChange={handleChange} className="w-full rounded-lg border py-2 px-3" />
                </div>
                <div className="mt-3" data-testid = 'parentDivFour'>
                  <label htmlFor="gender" className="block text-gray-700 mb-1 font-medium">
                    Gender
                  </label>
                  <select id="gender" value={formData.gender} onChange={handleChange} className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full">
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-3" data-testid = 'parentDivFive'>
                  <label htmlFor="language" className="block text-gray-700 mb-1 font-medium">
                    Preferred Language
                  </label>
                  <select id="language" value={formData.language} onChange={handleChange} className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full">
                    {languages.map((language) => (
                      <option key={language.value} value={language.value}>
                        {language.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="category" className="block mb-2 font-medium text-gray-700">
                Request Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={handleSearchInput}
                className="border border-gray-300 text-gray-700 rounded-lg p-2.5 w-full"
                onFocus={() => setShowDropdown(true)} 
                
              />
            {showDropdown && (
                <div className="absolute z-10 bg-white border mt-1 rounded shadow-lg w-full overflow-y-auto" 
                     style={{ maxHeight: '200px' }}>
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className="p-2 border-b cursor-pointer hover:bg-gray-100 relative"
                      onClick={() => !category.subcategories && handleCategoryClick(category.name)} 
                      onMouseEnter={() => setHoveredCategory(category)} 
                      onMouseLeave={() => setHoveredCategory(null)} 
                    >
                      {category.name}

                      {/* Show subcategories if the category is hovered and it has subcategories */}
                      {hoveredCategory === category && category.subcategories && (
                        <div className="bg-white border rounded shadow-lg p-2 z-20 mt-2">
                          {category.subcategories.map((subcategory, index) => (
                            <div
                              key={index}
                              className="cursor-pointer hover:bg-gray-200"
                              onClick={() => handleSubcategoryClick(subcategory)}
                            >
                              {subcategory}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="requestType" className="block mb-2 font-medium text-gray-700">
                Request Type
              </label>
              <select
                id="requestType"
                className="border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5"
                value={formData.request_type}
                onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
              >
                <option value="Remote">Remote</option>
                <option value="In Person">In Person</option>
              </select>
            </div>

            {formData.request_type === 'In Person' && (
              <div className="mt-3">
                <label htmlFor="location" className="block mb-1 font-medium text-gray-700">
                  Location
                </label>
                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (inputRef.current = ref)}
                    onPlacesChanged={handleOnPlacesChanges}
                  >
                    <input
                      type="text"
                      id="location"
                      value={formData.location} 
                      onChange={handleChange}
                      name="location"
                      className="border p-2 w-full rounded-lg"
                      placeholder="Search for location..."
                    />
                  </StandaloneSearchBox>
                )}
              </div>
            )}
          </div>

          <div className="mt-3" data-testid = 'parentDivSix'>
            {formData.category === 'Jobs' && <JobsCategory />}
            {formData.category === 'Housing' && <HousingCategory />} 
            <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
              Subject <span className="text-red-500">*</span> (Max 70 characters)
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject} onChange={handleChange}
              className="border p-2 w-full rounded-lg"
              maxLength={70}
              required
            />
          </div>

          <div className="mt-3" data-testid = 'parentDivSeven'>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description <span className="text-red-500">*</span> (Max 500 characters)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description} onChange={handleChange}
              className="border p-2 w-full rounded-lg"
              rows="5"
              maxLength={500}
              required
            ></textarea>
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600">
              Submit
            </button>
            <button onClick={isEdit ? onClose : closeForm} type="button" className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HelpRequestForm;
