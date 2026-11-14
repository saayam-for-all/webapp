/* eslint-env node */
import {
  isValidCityName,
  isValidStreetAddress,
  verifyAddressWithOpenStreetMap,
} from "./addressValidation";

const input = {
  street: "123 Main St",
  city: "Tempe",
  state: "Arizona",
  stateCode: "AZ",
  countryCode: "US",
};
const address = {
  house_number: "123",
  road: "Main Street",
  city: "Tempe",
  state: "Arizona",
  country_code: "us",
};
let endpoint;
const verify = (overrides = {}, options = {}) =>
  verifyAddressWithOpenStreetMap(
    { ...input, ...overrides },
    { endpoint, ...options },
  );
const respond = (results) =>
  fetch.mockResolvedValue({ ok: true, json: async () => results });

beforeEach(() => {
  global.fetch = jest.fn();
  endpoint = `https://geocoder.example.test/${expect.getState().currentTestName}`;
});
afterEach(() => {
  delete global.fetch;
  jest.useRealTimers();
});

it.each([
  "São Paulo",
  "東京",
  "Saint-Étienne",
  "St. John's",
  "श्रीनगर",
  "Ciudad de México",
])("allows international city %s", (city) => {
  expect(isValidCityName(city)).toBe(true);
});
it.each(["", "   ", "123", "<script>", "City@"])(
  "rejects malformed city %s",
  (city) => {
    expect(isValidCityName(city)).toBe(false);
  },
);
it.each(["12 Rue de l’Église", "Hauptstraße 12", "شارع النيل", "神田1-2-3"])(
  "allows international street %s",
  (street) => {
    expect(isValidStreetAddress(street)).toBe(true);
  },
);

it("matches a complete address and sends structured country-restricted search", async () => {
  respond([{ address }]);
  expect(await verify()).toEqual({ isValid: true, reason: null });
  const url = new URL(fetch.mock.calls[0][0]);
  expect(Object.fromEntries(url.searchParams)).toMatchObject({
    street: "123 Main St",
    city: "Tempe",
    state: "Arizona",
    countrycodes: "us",
    addressdetails: "1",
  });
  expect(url.searchParams.has("q")).toBe(false);
});
it.each([
  { city: "Phoenix" },
  { state: "California" },
  { country_code: "ca" },
  { road: "Other Street" },
  { house_number: "999" },
  { house_number: undefined },
  { road: undefined },
])("rejects a location mismatch %j", async (overrides) => {
  respond([{ address: { ...address, ...overrides } }]);
  expect((await verify()).isValid).toBe(false);
});
it("accepts a later matching result rather than trusting the first result", async () => {
  respond([{ address: { ...address, city: "Phoenix" } }, { address }]);
  expect((await verify()).isValid).toBe(true);
});
it("matches a village, accented name, international street, and ISO state code", async () => {
  respond([
    {
      address: {
        house_number: "12",
        road: "Rue de l’Église",
        village: "Saint-Étienne",
        state: "Localized region",
        "ISO3166-2-lvl4": "FR-ARA",
        country_code: "fr",
      },
    },
  ]);
  expect(
    (
      await verify({
        street: "12 Rue de l'Eglise",
        city: "Saint-Etienne",
        state: "Auvergne-Rhône-Alpes",
        stateCode: "ARA",
        countryCode: "FR",
      })
    ).isValid,
  ).toBe(true);
});
it("accepts a house number after the road name", async () => {
  respond([
    { address: { ...address, road: "Hauptstraße", house_number: "12" } },
  ]);
  expect((await verify({ street: "Hauptstraße 12" })).isValid).toBe(true);
});
it("does not mistake a numbered street for the requested house", async () => {
  respond([{ address: { ...address, road: "42nd Street" } }]);
  expect((await verify({ street: "123 42nd Street" })).isValid).toBe(true);
});
it.each([[], [null], [{}], [{ address: {} }]].map((value) => [value]))(
  "handles no usable result %j",
  async (results) => {
    respond(results);
    expect(await verify()).toEqual({ isValid: false, reason: "not_found" });
  },
);
it.each([null, {}, "bad response"])(
  "handles malformed response %j",
  async (results) => {
    respond(results);
    expect((await verify()).reason).toBe("unavailable");
  },
);
it("handles HTTP failure", async () => {
  fetch.mockResolvedValue({ ok: false });
  expect((await verify()).reason).toBe("unavailable");
});
it("handles a network failure", async () => {
  fetch.mockRejectedValue(new Error("offline"));
  expect((await verify()).reason).toBe("unavailable");
});
it("handles invalid JSON", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: async () => {
      throw new Error("invalid JSON");
    },
  });
  expect((await verify()).reason).toBe("unavailable");
});
it("requires configuration rather than transmitting profile data to the public service", async () => {
  expect((await verify({}, { endpoint: "" })).reason).toBe("unavailable");
  expect(fetch).not.toHaveBeenCalled();
});
it("does not request invalid input", async () => {
  expect((await verify({ city: "" })).reason).toBe("invalid_input");
  expect(fetch).not.toHaveBeenCalled();
});
it("times out a stalled service", async () => {
  jest.useFakeTimers();
  fetch.mockImplementation(
    (url, { signal }) =>
      new Promise((resolve, reject) =>
        signal.addEventListener("abort", () => reject(new Error("aborted"))),
      ),
  );
  const result = verify();
  await jest.advanceTimersByTimeAsync(10000);
  expect((await result).reason).toBe("unavailable");
});
it("cancels a request when the component unmounts", async () => {
  const controller = new AbortController();
  fetch.mockImplementation(
    (url, { signal }) =>
      new Promise((resolve, reject) =>
        signal.addEventListener("abort", () => reject(new Error("aborted"))),
      ),
  );
  const result = verify({}, { signal: controller.signal });
  controller.abort();
  expect((await result).reason).toBe("cancelled");
});
it("caches successes briefly, then revalidates", async () => {
  jest.useFakeTimers();
  respond([{ address }]);
  await verify();
  await verify();
  expect(fetch).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(300001);
  await verify();
  expect(fetch).toHaveBeenCalledTimes(2);
});
it("does not cache a failed lookup", async () => {
  respond([]);
  await verify();
  respond([{ address }]);
  expect((await verify()).isValid).toBe(true);
  expect(fetch).toHaveBeenCalledTimes(2);
});

it("does not erase meaningful vowel marks in non-Latin city names", async () => {
  respond([{ address: { ...address, city: "कानपुर" } }]);
  expect((await verify({ city: "कनपर" })).isValid).toBe(false);
});
