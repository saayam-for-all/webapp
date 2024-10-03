import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loadCategories } from '../../redux/features/help_request/requestActions';
import JobsCategory from "./Categories/JobCategory";
import { IoMdInformationCircle } from "react-icons/io";
import {GoogleMap, useJsApiLoader, StandaloneSearchBox} from '@react-google-maps/api';

const genderOptions = [
  { value: 'Select', label: 'Select'},
  { value: 'Woman', label: 'Woman' },
  { value: 'Man', label: 'Man' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Transgender', label: 'Transgender' },
  { value: 'Intersex', label: 'Intersex' },
  { value: 'Gender-nonconforming', label: 'Gender-nonconforming' },
];

const HelpRequestForm = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.request);

  const [selfFlag, setSelfFlag] = useState(true);
  const [languages, setLanguages] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [showSubcategories, setShowSubcategories] = useState(false);

  const [requestType, setRequestType] = useState('');
  

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
    // Dispatch categories action and fetch languages
    dispatch(loadCategories());
    fetchLanguages();
  }, [dispatch]);

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setShowSubcategories(!showSubcategories);
    } else {
      setSelectedCategory(categoryName);
      setShowSubcategories(true);
    }
  };

  const inputref = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDv7--yEnq84ZN3l03y50O33M4S89Un4U0",
    libraries: ["places"]
  });

  const handleOnPlacesChanges = () => {
    let address = inputref.current.getPlaces();
  };

  const handleForSelfFlag = (e) => {
    setSelfFlag(e.target.value === "yes");
  };


  return (
    <div className="bg-gray-100">
      <div className="w-full max-w-3xl mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h1 className="text-2xl font-bold text-gray-800 ">Create Help Request</h1>

          <div className="flex items-start gap-2 p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50" role="alert">
            <IoMdInformationCircle size={22} />
            <div>
              <span className="font-medium">Note:</span> We do not handle life-threatening emergency requests. Please call your local emergency service if you need urgent help.
            </div>
          </div>

          <div className="mt-3">
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
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-gray-700 mb-1 font-medium">
                    First Name
                  </label>
                  <input type="text" id="first_name" className="w-full rounded-lg border py-2 px-3" />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-gray-700 mb-1 font-medium">
                    Last Name
                  </label>
                  <input type="text" id="last_name" className="w-full rounded-lg border py-2 px-3" />
                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">
                  Email
                </label>
                <input type="email" id="email" className="w-full rounded-lg border py-2 px-3" />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-1 font-medium">
                    Phone
                  </label>
                  <input type="text" id="phone" className="w-full rounded-lg border py-2 px-3" />
                </div>
                <div>
                  <label htmlFor="age" className="block text-gray-700 mb-1 font-medium">
                    Age
                  </label>
                  <input type="number" id="age" className="w-full rounded-lg border py-2 px-3" />
                </div>
                <div className="mt-3">
                  <label htmlFor="gender" className="block text-gray-700 mb-1 font-medium">
                    Gender
                  </label>
                  <select id="gender" className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full">
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-3">
                  <label htmlFor="language" className="block text-gray-700 mb-1 font-medium">
                    Preferred Language
                  </label>
                  <select id="language" className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full">
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
            <div>
              <label htmlFor="calamity" className="block text-gray-700 font-medium mb-1">
                Is Calamity?
              </label>
              <input
                id="calamity"
                type="checkbox"
                name="calamity"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block mb-1 font-medium text-gray-700">
                Priority
              </label>
              <select id="priority" className="border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5" defaultValue={"low"}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="category" className="block mb-2 font-medium text-gray-700">
                Request Category
              </label>
              <button
                onClick={() => setShowSubcategories((prev) => !prev)}
                className="border border-gray-300 text-gray-700 rounded-lg p-2.5 w-full text-left bg-white"
              >
                {selectedCategory || 'Select Category'}
              </button>

              {showSubcategories && (
                 <div 
                 className="absolute z-10 bg-white border mt-1 rounded shadow-lg w-full overflow-y-auto" 
                 style={{ maxHeight: '200px' }}  
               >
                  {categories.map((category) => (
                    <div key={category.id} className="p-2 border-b">
                      <div
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        {category.name}
                      </div>
                      {selectedCategory === category.name && category.subcategories && (
                        <div className="ml-4 mt-2">
                          {category.subcategories.map((subcategory, index) => (
                            <div
                              key={index}
                              className="cursor-pointer hover:bg-gray-200"
                              onClick={() => {
                                setSelectedCategory(subcategory);
                                setShowSubcategories(false);
                              }}
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
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
              >
                <option value="remote">Remote</option>
                <option value="inPerson">In Person</option>
              </select>
            </div>

            {requestType === 'inPerson' && (
              <div className="mt-3">
                <label htmlFor="location" className="block mb-1 font-medium text-gray-700">
                  Location
                </label>
                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (inputref.current = ref)}
                    onPlacesChanged={handleOnPlacesChanges}
                  >
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="border p-2 w-full rounded-lg"
                    />
                  </StandaloneSearchBox>
                )}
              </div>
            )}
          </div>

          <div className="mt-3">
            {selectedCategory === 'Jobs' && <JobsCategory />}
            <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
              Subject <span className="text-red-500">*</span> (Max 70 characters)
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="border p-2 w-full rounded-lg"
              maxLength={70}
              required
            />
          </div>

          <div className="mt-3">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description <span className="text-red-500">*</span> (Max 500 characters)
            </label>
            <textarea
              id="description"
              name="description"
              className="border p-2 w-full rounded-lg"
              rows="5"
              maxLength={500}
              required
            ></textarea>
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg">
              Cancel
            </button>
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpRequestForm;
