import React, { useState } from "react";
// Only for Senior Living subcategory
// ElderlySupport Component
const ElderlySupport = () => {
  // ---------- STATE VARIABLES ----------
  const [subcategory, setSubcategory] = useState(""); // current selected subcategory
  const [showModal, setShowModal] = useState(false); // controls popup visibility
  const [formLocked, setFormLocked] = useState(false); // locks subcategory dropdown after saving

  // Senior Living Form Data
  const [seniorLivingData, setSeniorLivingData] = useState({
    location: "",
    budgetMin: "",
    budgetMax: "",
    facilityType: "",
    moveTimeline: "",
    amenities: [],
    specialRequirements: "",
    contactPerson: "",
    contactPhone: "",
  });

  // ---------- HANDLERS ----------
  // When subcategory changes
  const handleSubcategoryChange = (e) => {
    const selected = e.target.value;
    setSubcategory(selected);

    // Open popup only if "Senior Living" selected
    if (selected === "Senior Living") {
      setShowModal(true);
    }
  };

  // Handle text/number/select input changes inside modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSeniorLivingData({ ...seniorLivingData, [name]: value });
  };

  // Handle checkbox change for amenities
  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    let updatedAmenities = [...seniorLivingData.amenities];
    if (checked) {
      updatedAmenities.push(value);
    } else {
      updatedAmenities = updatedAmenities.filter((a) => a !== value);
    }
    setSeniorLivingData({ ...seniorLivingData, amenities: updatedAmenities });
  };

  // Save data and close modal
  const handleSave = () => {
    console.log("Saved Senior Living Data:", seniorLivingData);
    setShowModal(false);
    setFormLocked(true); // lock subcategory after saving
  };

  // Close modal without saving
  const handleClose = () => {
    setShowModal(false);
  };

  // ---------- RENDER ----------
  return (
    <div className="p-6 bg-white shadow-md rounded-xl max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Elderly Support</h2>

      {/* ----- CATEGORY DROPDOWN ----- */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Subcategory</label>
        <select
          value={subcategory}
          onChange={handleSubcategoryChange}
          disabled={formLocked} // lock after save
          className="w-full border p-2 rounded-lg"
        >
          <option value="">Select...</option>
          <option value="Senior Living">Senior Living</option>
          <option value="Medical Help">Medical Help</option>
          <option value="Home Assistance">Home Assistance</option>
          <option value="Emotional Support">Emotional Support</option>
          <option value="Financial / Legal Guidance">
            Financial / Legal Guidance
          </option>
        </select>

        {/* Message after saving */}
        {formLocked && (
          <p className="text-green-600 text-sm mt-2">
            Details saved for {subcategory}. You cannot change the subcategory
            now.
          </p>
        )}
      </div>

      {/* ----- POPUP MODAL (for Senior Living) ----- */}
      {showModal && (
        <>
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            {/* Modal container */}
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              >
                ×
              </button>

              <h3 className="text-xl font-semibold mb-4">
                Senior Living Relocation Help
              </h3>

              {/* Preferred Location */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Preferred Location (City / Zip)
                </label>
                <input
                  type="text"
                  name="location"
                  value={seniorLivingData.location}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              {/* Budget Range */}
              <div className="flex space-x-3 mb-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Budget Min ($)
                  </label>
                  <input
                    type="number"
                    name="budgetMin"
                    value={seniorLivingData.budgetMin}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Budget Max ($)
                  </label>
                  <input
                    type="number"
                    name="budgetMax"
                    value={seniorLivingData.budgetMax}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Facility Type */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Facility Type
                </label>
                <select
                  name="facilityType"
                  value={seniorLivingData.facilityType}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select type</option>
                  <option value="Independent">Independent</option>
                  <option value="Assisted">Assisted</option>
                  <option value="Memory Care">Memory Care</option>
                  <option value="Nursing">Nursing</option>
                </select>
              </div>

              {/* Move Timeline */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Move Timeline
                </label>
                <select
                  name="moveTimeline"
                  value={seniorLivingData.moveTimeline}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select</option>
                  <option value="Immediate">Immediate</option>
                  <option value="1–3 months">1–3 months</option>
                  <option value="3–6 months">3–6 months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              {/* Amenities */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Amenities Needed
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Meals",
                    "Housekeeping",
                    "Medical Support",
                    "Transportation",
                  ].map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-1"
                    >
                      <input
                        type="checkbox"
                        value={amenity}
                        checked={seniorLivingData.amenities.includes(amenity)}
                        onChange={handleAmenityChange}
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Requirements */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Special Requirements
                </label>
                <textarea
                  name="specialRequirements"
                  value={seniorLivingData.specialRequirements}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full border rounded-lg p-2"
                ></textarea>
              </div>

              {/* Contact Person */}
              <div className="flex space-x-3 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={seniorLivingData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={seniorLivingData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleClose}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ElderlySupport;
