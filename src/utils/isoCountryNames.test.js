import { isoAlpha3ToName } from "./isoCountryNames";

describe("isoAlpha3ToName", () => {
  it("resolves a known alpha-3 code to an English country name", () => {
    expect(isoAlpha3ToName("AFG")).toBe("Afghanistan");
    expect(isoAlpha3ToName("USA")).toBe("United States");
    expect(isoAlpha3ToName("ALA")).toBe("Aland Islands");
  });

  it("returns the code itself for an unknown alpha-3 code", () => {
    expect(isoAlpha3ToName("XYZ")).toBe("XYZ");
  });

  it("returns empty string for a falsy code", () => {
    expect(isoAlpha3ToName("")).toBe("");
    expect(isoAlpha3ToName(null)).toBe("");
    expect(isoAlpha3ToName(undefined)).toBe("");
  });
});
