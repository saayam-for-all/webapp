import React from "react";
import PropTypes from "prop-types";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";

const PhoneNumberInputWithCountry = ({
  phone,
  setPhone,
  countryCode,
  setCountryCode,
  error,
  setError,
  label = "Phone Number",
  hideLabel = false,
  required = false,
  t = (x) => x,
}) => {
  // Manual length checks for specific countries
  const getExpectedLength = (countryCode) => {
    const lengthMap = {
      US: 10,
      CA: 10,
      GB: 10,
      AU: 9,
      DE: 10,
      FR: 10,
      IT: 10,
      ES: 9,
      JP: 10,
      IN: 10,
      BR: 10,
      MX: 10,
      AR: 10,
      CL: 9,
      CO: 10,
      PE: 9,
      VE: 10,
      EC: 9,
      UY: 8,
      PY: 9,
      BO: 8,
      CR: 8,
      PA: 8,
      GT: 8,
      HN: 8,
      SV: 8,
      NI: 8,
      CU: 8,
      DO: 10,
      HT: 8,
      JM: 10,
      TT: 10,
      BB: 10,
      AG: 10,
      KN: 10,
      LC: 10,
      VC: 10,
      GD: 10,
      BS: 10,
      BZ: 7,
      GY: 7,
      SR: 7,
      FK: 5,
      GF: 9,
      GP: 9,
      MQ: 9,
      BL: 9,
      MF: 9,
      SX: 10,
      CW: 7,
      AW: 7,
      BQ: 7,
      PR: 10,
      VI: 10,
      AS: 10,
      GU: 10,
      MP: 10,
      UM: 10,
    };
    return lengthMap[countryCode] || null;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);

      if (value.length === 0) {
        setError("Phone number is required");
      } else {
        const fullNumber = `${PHONECODESEN[countryCode]["secondary"]}${value}`;
        const parsed = parsePhoneNumberFromString(fullNumber);
        const expectedLength = getExpectedLength(countryCode);

        // Manual length check for known countries
        if (expectedLength && value.length > expectedLength) {
          setError("Please enter a valid phone number");
        } else if (!parsed || !parsed.isPossible()) {
          setError(undefined); // Don't show error while typing incomplete numbers
        } else if (!parsed.isValid()) {
          setError("Please enter a valid phone number");
        } else {
          setError(undefined);
        }
      }
    }
  };

  const handleBlur = () => {
    const value = phone;
    const fullNumber = `${PHONECODESEN[countryCode]["secondary"]}${value}`;
    const expectedLength = getExpectedLength(countryCode);

    if (!value) {
      setError("Phone number is required");
      return;
    }

    // Manual length check for known countries
    if (expectedLength && value.length !== expectedLength) {
      setError("Please enter a valid phone number");
      return;
    }

    // On blur, enforce strict validation using extended metadata
    const parsed = parsePhoneNumberFromString(fullNumber);
    if (!parsed || !parsed.isValid()) {
      setError("Please enter a valid phone number");
    }
  };

  const handleCountryCodeChange = (e) => {
    const selectedCode = e.target.value;
    setCountryCode(selectedCode);
    setError(undefined);
  };

  return (
    <div className="my-2 flex flex-col relative">
      {!hideLabel && <label htmlFor="phone">{label}</label>}
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
          onBlur={handleBlur}
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
  hideLabel: PropTypes.bool,
};

export default PhoneNumberInputWithCountry;
