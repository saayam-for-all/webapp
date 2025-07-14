import React from "react";
import PropTypes from "prop-types";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import { isValidPhoneNumber } from "react-phone-number-input";

const PhoneNumberInputWithCountry = ({
  phone,
  setPhone,
  countryCode,
  setCountryCode,
  error,
  setError,
  label = "Phone Number",
  required = false,
  t = (x) => x,
}) => {
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
      const fullNumber = `${PHONECODESEN[countryCode]["secondary"]}${value}`;
      if (value.length === 0) {
        setError("Phone number is required");
      } else if (!isValidPhoneNumber(fullNumber)) {
        setError("Please enter a valid phone number");
      } else {
        setError(undefined);
      }
    }
  };

  const handleCountryCodeChange = (e) => {
    const selectedCode = e.target.value;
    setCountryCode(selectedCode);
    setError(undefined);
  };

  return (
    <div className="my-2 flex flex-col relative">
      <label htmlFor="phone">{label}</label>
      <div className="flex space-x-2">
        <select
          id="countryCode"
          value={countryCode}
          onChange={handleCountryCodeChange}
          className="w-1/3 px-4 py-2 border border-gray-300 rounded-xl"
        >
          {getPhoneCodeslist(PHONECODESEN).map((option) => (
            <option key={option.code} value={option.code}>
              {option.country} ({option.dialCode})
            </option>
          ))}
        </select>
        <input
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          placeholder={t("YOUR_PHONE_NUMBER")}
          type="text"
          className={`w-2/3 px-4 py-2 border rounded-xl ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          required={required}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

PhoneNumberInputWithCountry.propTypes = {
  phone: PropTypes.string.isRequired,
  setPhone: PropTypes.func.isRequired,
  countryCode: PropTypes.string.isRequired,
  setCountryCode: PropTypes.func.isRequired,
  error: PropTypes.string,
  setError: PropTypes.func.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  t: PropTypes.func,
};

export default PhoneNumberInputWithCountry;
