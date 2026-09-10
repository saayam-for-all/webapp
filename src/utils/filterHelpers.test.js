import {
  getEnumsFromStorage,
  getCategoriesFromStorage,
  getStatusOptions,
  getPriorityOptions,
  getTypeOptions,
  getCategoryOptions,
  getDashboardCategoryOptions,
  flattenCategories,
  normalizeTypeValue,
  normalizeStatusValue,
  normalizePriorityValue,
} from "./filterHelpers";

const mockT = (key, fallback) => fallback;

describe("filterHelpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getEnumsFromStorage", () => {
    it("returns parsed enums when present", () => {
      localStorage.setItem(
        "enums",
        JSON.stringify({ requestType: { 0: "IN_PERSON" } }),
      );
      expect(getEnumsFromStorage()).toEqual({
        requestType: { 0: "IN_PERSON" },
      });
    });

    it("returns null when not present", () => {
      expect(getEnumsFromStorage()).toBeNull();
    });
  });

  describe("getCategoriesFromStorage", () => {
    it("returns parsed categories when present", () => {
      localStorage.setItem(
        "categories",
        JSON.stringify([{ catId: "1", catName: "Shelter" }]),
      );
      expect(getCategoriesFromStorage()).toEqual([
        { catId: "1", catName: "Shelter" },
      ]);
    });

    it("returns null when not present", () => {
      expect(getCategoriesFromStorage()).toBeNull();
    });
  });

  describe("getStatusOptions", () => {
    it("returns translated options from array-based enums", () => {
      localStorage.setItem(
        "enums",
        JSON.stringify({ requestStatus: ["CREATED", "RESOLVED"] }),
      );
      const options = getStatusOptions(mockT);
      expect(options).toEqual([
        { key: "All", value: "All", label: "All" },
        { key: "CREATED", value: "CREATED", label: "CREATED" },
        { key: "RESOLVED", value: "RESOLVED", label: "RESOLVED" },
      ]);
    });

    it("falls back to default values when enums missing", () => {
      const options = getStatusOptions(mockT);
      expect(options.some((o) => o.key === "CREATED")).toBe(true);
    });
  });

  describe("getPriorityOptions", () => {
    it("returns translated options from indexed-object enums (regression test)", () => {
      localStorage.setItem(
        "enums",
        JSON.stringify({
          requestPriority: { 0: "LOW", 1: "MEDIUM", 2: "HIGH" },
        }),
      );
      const options = getPriorityOptions(mockT);
      expect(options).toEqual([
        { key: "All", value: "All", label: "All" },
        { key: "LOW", value: "LOW", label: "LOW" },
        { key: "MEDIUM", value: "MEDIUM", label: "MEDIUM" },
        { key: "HIGH", value: "HIGH", label: "HIGH" },
      ]);
    });

    it("does not use numeric index as key (regression test)", () => {
      localStorage.setItem(
        "enums",
        JSON.stringify({ requestPriority: { 0: "LOW" } }),
      );
      const options = getPriorityOptions(mockT);
      const lowOption = options.find((o) => o.value === "LOW");
      expect(lowOption.key).toBe("LOW");
      expect(lowOption.key).not.toBe("0");
    });

    it("falls back to default values when enums missing", () => {
      const options = getPriorityOptions(mockT);
      expect(options.some((o) => o.key === "LOW")).toBe(true);
    });
  });

  describe("getTypeOptions", () => {
    it("returns translated options from indexed-object enums (regression test)", () => {
      localStorage.setItem(
        "enums",
        JSON.stringify({ requestType: { 0: "IN_PERSON", 1: "REMOTE" } }),
      );
      const options = getTypeOptions(mockT);
      expect(options).toEqual([
        { key: "All", value: "All", label: "All" },
        { key: "IN_PERSON", value: "IN_PERSON", label: "IN_PERSON" },
        { key: "REMOTE", value: "REMOTE", label: "REMOTE" },
      ]);
    });

    it("does not use numeric index as key (regression test)", () => {
      localStorage.setItem(
        "enums",
        JSON.stringify({ requestType: { 0: "IN_PERSON" } }),
      );
      const options = getTypeOptions(mockT);
      const option = options.find((o) => o.value === "IN_PERSON");
      expect(option.key).toBe("IN_PERSON");
      expect(option.key).not.toBe("0");
    });

    it("falls back to default values when enums missing", () => {
      const options = getTypeOptions(mockT);
      expect(options.some((o) => o.key === "IN_PERSON")).toBe(true);
    });
  });

  describe("normalizeTypeValue", () => {
    it("uppercases and replaces spaces with underscores", () => {
      expect(normalizeTypeValue("in person")).toBe("IN_PERSON");
    });

    it("returns null for falsy values", () => {
      expect(normalizeTypeValue(null)).toBeNull();
      expect(normalizeTypeValue("")).toBeNull();
    });
  });

  describe("normalizeStatusValue", () => {
    it("uppercases and replaces spaces with underscores", () => {
      expect(normalizeStatusValue("matching volunteer")).toBe(
        "MATCHING_VOLUNTEER",
      );
    });
  });

  describe("normalizePriorityValue", () => {
    it("uppercases and replaces spaces with underscores", () => {
      expect(normalizePriorityValue("medium")).toBe("MEDIUM");
    });
  });

  describe("getCategoryOptions", () => {
    it("translates using category name, not catId (regression test)", () => {
      localStorage.setItem(
        "categories",
        JSON.stringify([
          {
            catId: "0.0.0.0.0",
            catName: "GENERAL_CATEGORY",
            subcategories: [],
          },
        ]),
      );
      const translateSpy = jest.fn((key) => key);
      getCategoryOptions(translateSpy);

      expect(translateSpy).toHaveBeenCalledWith(
        "categories:REQUEST_CATEGORIES.GENERAL_CATEGORY.LABEL",
        "GENERAL_CATEGORY",
      );
      expect(translateSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("0.0.0.0.0"),
        expect.anything(),
      );
    });

    it("returns empty array when categories missing", () => {
      expect(getCategoryOptions(mockT)).toEqual([]);
    });
  });

  describe("flattenCategories", () => {
    it("translates using category name, not catId (regression test)", () => {
      const translateSpy = jest.fn((key) => key);
      flattenCategories(
        [{ catId: "0.0.0.0.0", catName: "GENERAL_CATEGORY" }],
        translateSpy,
      );

      expect(translateSpy).toHaveBeenCalledWith(
        "categories:REQUEST_CATEGORIES.GENERAL_CATEGORY.LABEL",
        "GENERAL_CATEGORY",
      );
    });

    it("flattens nested subcategories with correct depth", () => {
      const result = flattenCategories(
        [
          {
            catId: "1",
            catName: "PARENT",
            subcategories: [{ catId: "1.1", catName: "CHILD" }],
          },
        ],
        mockT,
      );

      expect(result).toHaveLength(2);
      expect(result[0].depth).toBe(0);
      expect(result[1].depth).toBe(1);
    });
  });

  describe("getDashboardCategoryOptions", () => {
    const apiCategories = [
      {
        catId: "0.0.0.0.0",
        catName: "GENERAL_CATEGORY",
        subCategories: [],
      },
      {
        catId: "1",
        catName: "FOOD_AND_ESSENTIALS",
        subCategories: [
          { catId: "1.1", catName: "FOOD_ASSISTANCE", subCategories: [] },
        ],
      },
    ];

    it("returns all API categories when there is no request data yet", () => {
      localStorage.setItem("categories", JSON.stringify(apiCategories));
      const result = getDashboardCategoryOptions([], mockT);

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe("GENERAL_CATEGORY");
      expect(result[1].subCategories).toHaveLength(1);
    });

    it("translates using catName, not catId (regression test)", () => {
      localStorage.setItem("categories", JSON.stringify(apiCategories));
      const translateSpy = jest.fn((key) => key);

      getDashboardCategoryOptions([], translateSpy);

      expect(translateSpy).toHaveBeenCalledWith(
        "categories:REQUEST_CATEGORIES.GENERAL_CATEGORY.LABEL",
        "GENERAL_CATEGORY",
      );
    });

    it("uses API categories when they sufficiently match request data", () => {
      localStorage.setItem("categories", JSON.stringify(apiCategories));
      const dataRows = [
        { category: "GENERAL_CATEGORY" },
        { category: "FOOD_AND_ESSENTIALS" },
      ];

      const result = getDashboardCategoryOptions(dataRows, mockT);

      expect(result).toHaveLength(2);
      expect(result.map((c) => c.category)).toEqual([
        "GENERAL_CATEGORY",
        "FOOD_AND_ESSENTIALS",
      ]);
    });

    it("falls back to data-derived categories when API categories don't match", () => {
      localStorage.setItem("categories", JSON.stringify(apiCategories));
      const dataRows = [
        { category: "SOME_UNRELATED_CATEGORY" },
        { category: "ANOTHER_UNRELATED_CATEGORY" },
      ];

      const result = getDashboardCategoryOptions(dataRows, mockT);

      expect(result.map((c) => c.category)).toEqual([
        "ANOTHER_UNRELATED_CATEGORY",
        "SOME_UNRELATED_CATEGORY",
      ]);
    });

    it("returns empty array when no categories and no data exist", () => {
      const result = getDashboardCategoryOptions([], mockT);
      expect(result).toEqual([]);
    });
  });
});
