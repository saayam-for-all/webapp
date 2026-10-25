import { resolveCountryIso } from "./countryUtils";

describe("resolveCountryIso", () => {
  it("returns US for null", () => {
    expect(resolveCountryIso(null)).toBe("US");
  });

  it("returns US for undefined", () => {
    expect(resolveCountryIso(undefined)).toBe("US");
  });

  it("returns US for empty string", () => {
    expect(resolveCountryIso("")).toBe("US");
  });

  it("returns ISO as-is when already a valid ISO Alpha-2 code", () => {
    expect(resolveCountryIso("US")).toBe("US");
  });

  it("returns correct ISO for another valid Alpha-2 code", () => {
    expect(resolveCountryIso("AR")).toBe("AR");
  });

  it("converts full country name to ISO Alpha-2", () => {
    expect(resolveCountryIso("United States")).toBe("US");
  });

  it("converts another full country name to ISO Alpha-2", () => {
    expect(resolveCountryIso("Argentina")).toBe("AR");
  });

  it("falls back to US for unrecognized string", () => {
    expect(resolveCountryIso("Narnia")).toBe("US");
  });
});
