import { useState, useEffect } from "react";
import { IoMdInformationCircle } from "react-icons/io";

const genderOptions = [
  { value: 'Woman', label: 'Woman' },
  { value: 'Man', label: 'Man' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Transgender', label: 'Transgender' },
  { value: 'Intersex', label: 'Intersex' },
  { value: 'Gender-nonconforming', label: 'Gender-nonconforming' },
];

const HelpRequestForm = () => {
  const [selfFlag, setSelfFlag] = useState(true);
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
  }, []);

  const handleForSelfFlag = (e) => {
    setSelfFlag(e.target.value === "yes");
  };

  return (
    <div className="bg-gray-100">
      <div className="w-full max-w-3xl mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h1 className="text-2xl font-bold text-gray-800 ">
            Create Help Request
          </h1>

          <div
            className="flex items-center gap-1 p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50"
            role="alert"
          >
            <IoMdInformationCircle size={20} />
            <div>
              <span className="font-medium">Note:</span> We do not handle life-threatening emergency requests. Please call your local emergency service if you need urgent help.
            </div>
          </div>

          <div className="mt-3">
            <label
              htmlFor="self"
              className="block mb-1 text-gray-700 font-medium"
            >
              For Self
            </label>
            <select
              id="self"
              className="border border-gray-300 text-gray-700 rounded-lg p-2 w-24"
              onChange={handleForSelfFlag}
            >
              {/* <option selected>Choose a option</option> */}
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {!selfFlag && (
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-4 ">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-gray-700 mb-1 font-medium"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    className="w-full rounded-lg border py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-gray-700 mb-1 font-medium"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    className="w-full rounded-lg border py-2 px-3"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="email"
                  className="block text-gray-700 mb-1 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border py-2 px-3"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 mb-1 font-medium"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className="w-full rounded-lg border py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className="block text-gray-700 mb-1 font-medium"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    className="w-full rounded-lg border py-2 px-3"
                  />
                </div>
                <div className="mt-3">
                  <label
                    htmlFor="gender"
                    className="block text-gray-700 mb-1 font-medium"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full"
                  >
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-3">
                  <label
                    htmlFor="language"
                    className="block text-gray-700 mb-1 font-medium"
                  >
                    Preferred Language
                  </label>
                  <select
                    id="language"
                    className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full"
                  >
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
              <label
                htmlFor="calamity"
                className="block text-gray-700 font-medium mb-1"
              >
                Is Calamity?
              </label>
              <input
                id="calamity"
                type="checkbox"
                value=""
                name="calamity"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block mb-1 font-medium text-gray-700"
              >
                Priority
              </label>
              <select
                id="priority"
                className="border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5"
                defaultValue={"low"}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block mb-2 font-medium text-gray-700"
              >
                Request Category
              </label>
              <select
                id="category"
                className="border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5"
                defaultValue={"health"}
              >
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="electronics">Electronics</option>
                <option value="logistics">Logistics</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="requestType"
                className="block mb-2 font-medium text-gray-700"
              >
                Request Type
              </label>
              <select
                id="requestType"
                className="border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5"
                defaultValue={"remote"}
              >
                <option value="inPerson">In Person</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label
              htmlFor="subject"
              className="block text-gray-700 font-medium mb-2"
            >
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
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description <span className="text-red-500">*</span>
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
