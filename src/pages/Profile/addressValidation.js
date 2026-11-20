// Adapted from KanishkKumar11's proposal in webapp PR #1969.
// City datasets are incomplete: let the geocoder verify the actual location.
const normalize = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const normalizeRoad = (value) =>
  normalize(value).replace(
    /\b(street|road|avenue|boulevard|drive|lane|court|place|highway|north|south|east|west)\b/g,
    (word) =>
      ({
        street: "st",
        road: "rd",
        avenue: "ave",
        boulevard: "blvd",
        drive: "dr",
        lane: "ln",
        court: "ct",
        place: "pl",
        highway: "hwy",
        north: "n",
        south: "s",
        east: "e",
        west: "w",
      })[word],
  );

export const isValidStreetAddress = (value) =>
  typeof value === "string" &&
  /\p{L}/u.test(value) &&
  !/[<>]/.test(value) &&
  !Array.from(value).some((character) => character.codePointAt(0) < 32);

export const isValidCityName = (value) =>
  typeof value === "string" &&
  /^[\p{L}\p{M}\p{N}\s.'’(),/-]+$/u.test(value.trim()) &&
  /\p{L}/u.test(value);

const matchesStreet = (street, address) => {
  const road =
    address.road ||
    address.pedestrian ||
    address.residential ||
    address.footway;
  if (!road) return false;
  // Match a house number at either end (e.g. "12 Rue …" or "… Straße 12").
  const houseNumber = street
    .trim()
    .match(
      /^(\d+[\p{L}]?(?:[-/]\d+[\p{L}]?)?)\s+|\s+(\d+[\p{L}]?(?:[-/]\d+[\p{L}]?)?)$/u,
    );
  const number = houseNumber?.[1] || houseNumber?.[2];
  const streetName = houseNumber ? street.replace(houseNumber[0], "") : street;
  return (
    normalizeRoad(streetName) === normalizeRoad(road) &&
    (!number || normalize(number) === normalize(address.house_number))
  );
};

const matchesLocation = (input, address) => {
  const cityMatches = [
    "city",
    "town",
    "village",
    "municipality",
    "hamlet",
    "borough",
    "city_district",
    "suburb",
  ].some(
    (key) => address[key] && normalize(address[key]) === normalize(input.city),
  );
  const stateCodes = Object.entries(address)
    .filter(([key]) => key.startsWith("ISO3166-2-"))
    .map(([, value]) => String(value).toUpperCase());
  const stateMatches =
    stateCodes.includes(
      `${input.countryCode}-${input.stateCode}`.toUpperCase(),
    ) ||
    ["state", "region", "province", "state_district", "county"].some(
      (key) =>
        address[key] && normalize(address[key]) === normalize(input.state),
    );
  return (
    cityMatches &&
    stateMatches &&
    address.country_code?.toLowerCase() === input.countryCode.toLowerCase() &&
    matchesStreet(input.street, address)
  );
};

// Keep successful lookups in memory only; never persist addresses in a new cache.
const verifiedAddresses = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export const verifyAddressWithOpenStreetMap = async (
  input,
  { endpoint = import.meta.env.VITE_ADDRESS_VERIFICATION_URL, signal } = {},
) => {
  if (
    !isValidStreetAddress(input.street) ||
    !isValidCityName(input.city) ||
    !input.state ||
    !input.stateCode ||
    !/^[a-z]{2}$/i.test(input.countryCode || "")
  ) {
    return { isValid: false, reason: "invalid_input" };
  }
  // The public Nominatim service forbids personal/confidential data. Deployment
  // must configure a Nominatim-compatible service suitable for profile addresses.
  if (!endpoint) return { isValid: false, reason: "unavailable" };
  if (signal?.aborted) return { isValid: false, reason: "cancelled" };

  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(abort, 10000);
  try {
    const url = new URL(endpoint, window.location.origin);
    const params = {
      street: input.street.trim(),
      city: input.city.trim(),
      state: input.state,
      countrycodes: input.countryCode.toLowerCase(),
      format: "jsonv2",
      addressdetails: "1",
      limit: "5",
      "accept-language": input.language || "en",
    };
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
    const cacheKey = `${url.toString()}|${input.stateCode}`;
    if (verifiedAddresses.get(cacheKey) > Date.now())
      return { isValid: true, reason: null };
    const response = await fetch(url.toString(), { signal: controller.signal });
    if (!response.ok) return { isValid: false, reason: "unavailable" };
    const results = await response.json();
    if (!Array.isArray(results))
      return { isValid: false, reason: "unavailable" };
    const isValid = results.some(
      (result) => result?.address && matchesLocation(input, result.address),
    );
    if (isValid) {
      if (verifiedAddresses.size >= 20)
        verifiedAddresses.delete(verifiedAddresses.keys().next().value);
      verifiedAddresses.set(cacheKey, Date.now() + CACHE_TTL);
    }
    return { isValid, reason: isValid ? null : "not_found" };
  } catch {
    return {
      isValid: false,
      reason: signal?.aborted ? "cancelled" : "unavailable",
    };
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
};
