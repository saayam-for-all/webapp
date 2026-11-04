import { City } from "country-state-city";

const normalizeCityName = (name = "") =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

export const validateCityName = (cityName, countryCode, stateCode) => {
  if (!cityName?.trim() || !countryCode || !stateCode) {
    return null;
  }

  const cities = City.getCitiesOfState(countryCode, stateCode);

  // Do not reject a city when the local dataset has no records.
  if (!cities.length) {
    return null;
  }

  const normalizedInput = normalizeCityName(cityName);

  return cities.some(
    (city) => normalizeCityName(city.name) === normalizedInput,
  );
};

export const isValidStreetAddress = (streetAddress) => {
  if (!streetAddress?.trim() || streetAddress.trim().length < 5) {
    return false;
  }

  // Allow international letters, numbers, spaces, and common address punctuation.
  return /^[\p{L}\p{N}\s.,'’#/-]+$/u.test(streetAddress.trim());
};

const getCityFromAddress = (address) =>
  address.city ||
  address.town ||
  address.village ||
  address.municipality ||
  address.hamlet ||
  address.city_district ||
  "";

const getStateFromAddress = (address) =>
  address.state || address.region || address.province || "";

const extractHouseNumber = (street) => {
  const match = street.trim().match(/^([\p{N}]+[a-zA-Z]?)\s+/u);
  return match ? normalizeCityName(match[1]) : "";
};

const matchesStreet = (streetInput, address) => {
  const road = address.road || address.pedestrian || address.residential || "";

  if (!road) {
    return false;
  }

  const normalizedInput = normalizeCityName(streetInput);
  const normalizedRoad = normalizeCityName(road);
  const inputHouseNumber = extractHouseNumber(streetInput);
  const resultHouseNumber = normalizeCityName(address.house_number || "");

  // Require an exact road-name match rather than accepting partial names.
  const roadMatches =
    normalizedInput === normalizedRoad ||
    normalizedInput.replace(/^\d+\s*/, "") === normalizedRoad;

  if (!roadMatches) {
    return false;
  }

  // If the user entered a house number, Nominatim must confirm it.
  if (inputHouseNumber) {
    return Boolean(resultHouseNumber && resultHouseNumber === inputHouseNumber);
  }

  return true;
};

export const verifyAddressWithOpenStreetMap = async ({
  street,
  city,
  state,
  country,
  countryCode,
  postalCode,
}) => {
  if (!street?.trim() || !city?.trim() || !state?.trim() || !country?.trim()) {
    return { isValid: false, reason: "invalid_input" };
  }

  const params = new URLSearchParams({
    street: street.trim(),
    city: city.trim(),
    state: state.trim(),
    country: country.trim(),
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
  });

  if (postalCode?.trim()) {
    params.set("postalcode", postalCode.trim());
  }

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  let response;

  try {
    response = await fetch(url, {
      headers: {
        "Accept-Language": "en",
      },
    });
  } catch {
    return { isValid: false, reason: "unavailable" };
  }

  if (!response.ok) {
    return { isValid: false, reason: "unavailable" };
  }

  let results;

  try {
    results = await response.json();
  } catch {
    return { isValid: false, reason: "unavailable" };
  }

  if (!Array.isArray(results) || results.length === 0) {
    return { isValid: false, reason: "not_found" };
  }

  const normalizedCity = normalizeCityName(city);
  const normalizedState = normalizeCityName(state);
  const normalizedCountry = normalizeCityName(country);
  const normalizedCountryCode = countryCode?.toLowerCase();

  const matchingResult = results.some((result) => {
    const address = result.address || {};

    const resultCity = normalizeCityName(getCityFromAddress(address));
    const resultState = normalizeCityName(getStateFromAddress(address));
    const resultCountry = normalizeCityName(address.country || "");
    const resultCountryCode = (address.country_code || "").toLowerCase();

    const cityMatches = resultCity === normalizedCity;
    const stateMatches = resultState === normalizedState;

    const countryMatches =
      resultCountry === normalizedCountry ||
      (normalizedCountryCode && resultCountryCode === normalizedCountryCode);

    return (
      cityMatches &&
      stateMatches &&
      countryMatches &&
      matchesStreet(street, address)
    );
  });

  return matchingResult
    ? { isValid: true, reason: null }
    : { isValid: false, reason: "mismatch" };
};
