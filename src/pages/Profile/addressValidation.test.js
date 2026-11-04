import {
  validateCityName,
  isValidStreetAddress,
  verifyAddressWithOpenStreetMap,
} from "./addressValidation";

beforeAll(() => {
  global.fetch = jest.fn();
});

afterAll(() => {
  delete global.fetch;
});

describe("validateCityName", () => {
  it("accepts a valid city in the selected state", () => {
    expect(validateCityName("Tempe", "US", "AZ")).toBe(true);
  });

  it("matches city names regardless of letter case", () => {
    expect(validateCityName("tEmPe", "US", "AZ")).toBe(true);
  });

  it("ignores leading and trailing whitespace", () => {
    expect(validateCityName("  Tempe  ", "US", "AZ")).toBe(true);
  });

  it("rejects a city not found in the selected state", () => {
    expect(validateCityName("Nonexistent City", "US", "AZ")).toBe(false);
  });

  it("returns null when country information is missing", () => {
    expect(validateCityName("Tempe", "", "AZ")).toBe(null);
  });

  it("returns null when state information is missing", () => {
    expect(validateCityName("Tempe", "US", "")).toBe(null);
  });

  it("returns null when city information is missing", () => {
    expect(validateCityName("", "US", "AZ")).toBe(null);
  });

  it("returns null when the selected state has no city records", () => {
    expect(validateCityName("Some City", "XX", "XX")).toBe(null);
  });
});

describe("isValidStreetAddress", () => {
  it("accepts a valid street address", () => {
    expect(isValidStreetAddress("123 Main Street")).toBe(true);
  });

  it("accepts international characters and common punctuation", () => {
    expect(isValidStreetAddress("12 Rue de l'Église")).toBe(true);
  });

  it("rejects an empty address", () => {
    expect(isValidStreetAddress("")).toBe(false);
  });

  it("rejects an address shorter than five characters", () => {
    expect(isValidStreetAddress("123")).toBe(false);
  });

  it("rejects unsupported special characters", () => {
    expect(isValidStreetAddress("123 Main Street @@@")).toBe(false);
  });
});

describe("verifyAddressWithOpenStreetMap", () => {
  const addressInput = {
    street: "123 Main Street",
    city: "Tempe",
    state: "Arizona",
    country: "United States",
    countryCode: "US",
    postalCode: "85281",
  };

  beforeEach(() => {
    global.fetch.mockReset();
  });

  it("accepts a matching OpenStreetMap result", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          address: {
            house_number: "123",
            road: "Main Street",
            city: "Tempe",
            state: "Arizona",
            country: "United States",
            country_code: "us",
          },
        },
      ],
    });

    const result = await verifyAddressWithOpenStreetMap(addressInput);

    expect(result).toEqual({ isValid: true, reason: null });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("rejects an address when no results are found", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await verifyAddressWithOpenStreetMap(addressInput);

    expect(result).toEqual({ isValid: false, reason: "not_found" });
  });

  it("rejects an address that does not match the returned location", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          address: {
            house_number: "999",
            road: "Other Street",
            city: "Phoenix",
            state: "Arizona",
            country: "United States",
            country_code: "us",
          },
        },
      ],
    });

    const result = await verifyAddressWithOpenStreetMap(addressInput);

    expect(result).toEqual({ isValid: false, reason: "mismatch" });
  });

  it("reports when the OpenStreetMap service is unavailable", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    const result = await verifyAddressWithOpenStreetMap(addressInput);

    expect(result).toEqual({ isValid: false, reason: "unavailable" });
  });

  it("reports an unsuccessful server response", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 503,
    });

    const result = await verifyAddressWithOpenStreetMap(addressInput);

    expect(result).toEqual({ isValid: false, reason: "unavailable" });
  });

  it("does not request verification when required fields are missing", async () => {
    const result = await verifyAddressWithOpenStreetMap({
      ...addressInput,
      city: "",
    });

    expect(result).toEqual({ isValid: false, reason: "invalid_input" });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
