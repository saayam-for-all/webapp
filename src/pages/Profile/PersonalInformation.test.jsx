import { getLocaleAndFormat } from "./PersonalInformation";

describe("PersonalInformation utility - getLocaleAndFormat", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns default locale and format for United States", async () => {
    global.fetch.mockResolvedValue({
      json: async () => [
        {
          cca2: "US",
          languages: { eng: "English" },
        },
      ],
    });

    const result = await getLocaleAndFormat("United States");

    expect(result.locale).toBe("en-US");
    expect(result.dateFormat).toBe("MM/dd/yyyy");
    expect(result.placeholder).toBe("MM/DD/YYYY");
  });

  it("handles countries with day/month/year order like India", async () => {
    global.fetch.mockResolvedValue({
      json: async () => [
        {
          cca2: "IN",
          languages: { eng: "English" },
        },
      ],
    });

    const result = await getLocaleAndFormat("India");

    expect(result.locale).toBe("en-IN");
    expect(result.dateFormat).toBe("dd/MM/yyyy");
    expect(result.placeholder).toBe("DD/MM/YYYY");
  });

  it("handles countries with day/month/year order like United Kingdom", async () => {
    global.fetch.mockResolvedValue({
      json: async () => [
        {
          cca2: "GB",
          languages: { eng: "English" },
        },
      ],
    });

    const result = await getLocaleAndFormat("United Kingdom");

    expect(result.locale).toBe("en-GB");
    expect(result.dateFormat).toBe("dd/MM/yyyy");
    expect(result.placeholder).toBe("DD/MM/YYYY");
  });

  it("falls back gracefully for unknown country names", async () => {
    global.fetch.mockResolvedValue({
      json: async () => [],
    });

    const result = await getLocaleAndFormat("NonExistentCountry123");

    expect(result.locale).toBe("en-US");
    expect(result.dateFormat).toBe("MM/dd/yyyy");
    expect(result.placeholder).toBe("MM/DD/YYYY");
  });

  it("handles error paths by returning en-US fallback", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    const result = await getLocaleAndFormat(null);

    expect(result.locale).toBe("en-US");
    expect(result.dateFormat).toBe("MM/dd/yyyy");
    expect(result.placeholder).toBe("MM/DD/YYYY");
  });
});
