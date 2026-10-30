import { getLocaleAndFormat } from "./PersonalInformation";

describe("PersonalInformation utility - getLocaleAndFormat", () => {
  it("returns default locale and format for United States", () => {
    const result = getLocaleAndFormat("United States");
    expect(result).toBeDefined();
    expect(result.locale).toBe("en-US");
    expect(result.dateFormat).toBe("MM/dd/yyyy");
    expect(result.placeholder).toBe("MM/DD/YYYY");
  });

  it("handles countries with day/month/year order like India", () => {
    const result = getLocaleAndFormat("India");
    expect(result).toBeDefined();
    expect(result.locale).toBe("en-IN");
    expect(result.dateFormat).toBe("dd/MM/yyyy");
    expect(result.placeholder).toBe("DD/MM/YYYY");
  });

  it("handles countries with day/month/year order like United Kingdom", () => {
    const result = getLocaleAndFormat("United Kingdom");
    expect(result).toBeDefined();
    expect(result.locale).toBe("en-GB");
    expect(result.dateFormat).toBe("dd/MM/yyyy");
    expect(result.placeholder).toBe("DD/MM/YYYY");
  });

  it("falls back gracefully for unknown or undefined country names", () => {
    const result = getLocaleAndFormat("NonExistentCountry123");
    expect(result).toBeDefined();
    expect(result.locale).toBe("en-US");
    expect(result.dateFormat).toBe("MM/dd/yyyy");
    expect(result.placeholder).toBe("MM/DD/YYYY");
  });

  it("handles error paths by returning en-US fallback", () => {
    const result = getLocaleAndFormat(null);
    expect(result).toBeDefined();
    expect(result.locale).toBe("en-US");
    expect(result.dateFormat).toBe("MM/dd/yyyy");
    expect(result.placeholder).toBe("MM/DD/YYYY");
  });
});
