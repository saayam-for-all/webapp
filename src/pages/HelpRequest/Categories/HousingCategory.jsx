import React, { useState } from "react";
import usePlacesSearchBox from "../location/usePlacesSearchBox";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";

const HousingCategory = () => {
  const [userType, setUserType] = useState("lookingToRent");
  const [housingInfo, setHousingInfo] = useState({
    location: "",
    budget: "",
    housingType: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    specialRequirements: "",
    moveInDate: "",
    moveOutDate: "",
    familySize: "",
    amenities: "",
    propertyLocation: "",
    propertyRent: "",
    furnishing: "Unfurnished",
    tenantRequirements: "",
    availability: "",
    leaseDuration: "Short-term",
  });
  const { inputRef, isLoaded, handleOnPlacesChanges } = usePlacesSearchBox();

  const housingTypes = ["Apartment", "House", "Shared housing"];
  const amenitiesOptions = ["Gym", "Pool", "Parking", "Security", "Laundry"];
  const furnishingOptions = ["Furnished", "Unfurnished"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHousingInfo({ ...housingInfo, [name]: value });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Are you looking to rent/lease a place, or are you offering a place for
        rent/lease?
      </h2>
      <div className="flex space-x-4 mb-6">
        <label>
          <input
            type="radio"
            value="lookingToRent"
            checked={userType === "lookingToRent"}
            onChange={() => setUserType("lookingToRent")}
          />
          Looking to Rent/Lease
        </label>
        <label>
          <input
            type="radio"
            value="offeringPlace"
            checked={userType === "offeringPlace"}
            onChange={() => setUserType("offeringPlace")}
          />
          Offering a Place for Rent/Lease
        </label>
      </div>

      {userType === "lookingToRent" && (
        <>
          <div className="mb-6">
            <h3 className="font-semibold">Rent/Lease Details</h3>

            <label>
              What location are you looking for? (City/Neighborhood)
            </label>
            {isLoaded && (
              <StandaloneSearchBox
                onLoad={(ref) => (inputRef.current = ref)}
                onPlacesChanged={handleOnPlacesChanges}
              >
                <input
                  type="text"
                  name="location"
                  value={housingInfo.location}
                  onChange={handleInputChange}
                  ref={inputRef}
                  onFocus={() => inputRef.current && handleOnPlacesChanges()}
                  className="w-full p-2 border rounded"
                />
              </StandaloneSearchBox>
            )}

            <label>What is your budget for rent?</label>
            <input
              type="text"
              name="budget"
              value={housingInfo.budget}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            <label>What type of housing are you looking for?</label>
            <select
              name="housingType"
              value={housingInfo.housingType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              {housingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label>How many bedrooms do you need?</label>
            <input
              type="number"
              name="bedrooms"
              min="1"
              value={housingInfo.bedrooms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            <label>How many bathrooms do you need?</label>
            <input
              type="number"
              name="bathrooms"
              min="1"
              value={housingInfo.bathrooms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            <label>
              Do you have any special requirements? (Pet-friendly, Parking,
              etc.)
            </label>
            <input
              type="text"
              name="specialRequirements"
              value={housingInfo.specialRequirements}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            <label>What is your preferred move-in and move-out date?</label>
            <input
              type="date"
              name="moveInDate"
              value={housingInfo.moveInDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              name="moveOutDate"
              value={housingInfo.moveOutDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-2"
            />

            <label>How many people will be living with you?</label>
            <input
              type="text"
              name="familySize"
              value={housingInfo.familySize}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            <label>Are you looking for any amenities?</label>
            <select
              name="amenities"
              value={housingInfo.amenities}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              {amenitiesOptions.map((amenity) => (
                <option key={amenity} value={amenity}>
                  {amenity}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {userType === "offeringPlace" && (
        <>
          <div className="mb-6">
            <h3 className="font-semibold">Property Details</h3>

            <label>What is the location of the property?</label>
            {isLoaded && (
              <StandaloneSearchBox
                onLoad={(ref) => (inputRef.current = ref)}
                onPlacesChanged={handleOnPlacesChanges}
              >
                <input
                  type="text"
                  name="propertyLocation"
                  value={housingInfo.propertyLocation}
                  onChange={handleInputChange}
                  ref={inputRef}
                  onFocus={() => inputRef.current && handleOnPlacesChanges()}
                  className="w-full p-2 border rounded"
                />
              </StandaloneSearchBox>
            )}
            <label>What is the rent or price you're offering?</label>
            <input
              type="text"
              name="propertyRent"
              value={housingInfo.propertyRent}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            <label>What type of housing are you offering?</label>
            <select
              name="housingType"
              value={housingInfo.housingType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              {housingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label>
              How many bedrooms and bathrooms does the property have?
            </label>
            <input
              type="number"
              name="bedrooms"
              min="1"
              value={housingInfo.bedrooms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="bathrooms"
              min="1"
              value={housingInfo.bathrooms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-2"
            />

            <label>Is the property furnished or unfurnished?</label>
            <select
              name="furnishing"
              value={housingInfo.furnishing}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              {furnishingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <label>What amenities does the property offer?</label>
            <select
              name="amenities"
              value={housingInfo.amenities}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              {amenitiesOptions.map((amenity) => (
                <option key={amenity} value={amenity}>
                  {amenity}
                </option>
              ))}
            </select>

            <label>Are there any special requirements for tenants?</label>
            <input
              type="text"
              name="tenantRequirements"
              value={housingInfo.tenantRequirements}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            <label>When is the property available for move-in?</label>
            <input
              type="date"
              name="availability"
              value={housingInfo.availability}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            <label>What is the duration of the lease?</label>
            <select
              name="leaseDuration"
              value={housingInfo.leaseDuration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="Short-term">Short-term</option>
              <option value="Long-term">Long-term</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default HousingCategory;
