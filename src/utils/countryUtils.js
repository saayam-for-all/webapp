import countryCodes from "./country-codes-en.json";

const countryNameToCode = Object.entries(countryCodes).reduce(
  (acc, [code, name]) => {
    acc[name] = code;
    return acc;
  },
  {},
);

export const resolveCountryIso = (zoneinfo) => {
  if (!zoneinfo) return "US";
  if (countryCodes[zoneinfo]) return zoneinfo;
  return countryNameToCode[zoneinfo] || "US";
};
