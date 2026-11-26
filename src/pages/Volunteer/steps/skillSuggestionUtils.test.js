import {
  buildSkillSuggestionPayload,
  flattenLeafSkills,
  normalizeSkillSuggestionResponse,
  resolveSuggestedSkills,
  getGeneralSkill,
  mergeSelectedSkills,
} from "./skillSuggestionUtils";

const categories = [
  {
    catId: "4",
    catName: "EDUCATION",
    subCategories: [
      {
        catId: "4.3",
        catName: "TUTORING",
        subCategories: [{ catId: "4.3.1", catName: "MATH" }],
      },
    ],
  },
  {
    catId: "general",
    catName: "GENERAL_CATEGORY",
  },
];

describe("Volunteer skill suggestion utilities", () => {
  it("builds the initial API payload", () => {
    expect(buildSkillSuggestionPayload("  I teach math  ")).toEqual({
      description: "I teach math",
      mode: "volunteer_skills",
    });
  });

  it("passes the previous session unchanged", () => {
    const session = {
      entries: [{ text: "I teach math", skills: [] }],
    };

    const payload = buildSkillSuggestionPayload("I can drive", session);

    expect(payload.session).toBe(session);
  });

  it("returns only leaf skills with their hierarchy", () => {
    expect(flattenLeafSkills(categories)).toEqual([
      {
        catId: "4.3.1",
        catName: "MATH",
        hierarchy: ["EDUCATION", "TUTORING", "MATH"],
      },
      {
        catId: "general",
        catName: "GENERAL_CATEGORY",
        hierarchy: ["GENERAL_CATEGORY"],
      },
    ]);
  });

  it("maps API suggestions to existing category IDs", () => {
    const result = resolveSuggestedSkills(
      [{ category_number: "4.3.1", category_name: "MATH" }],
      categories,
    );

    expect(result).toHaveLength(1);
    expect(result[0].catId).toBe("4.3.1");
  });

  it("supports unique category names when IDs differ", () => {
    const result = resolveSuggestedSkills(
      [{ category_number: "different", category_name: "MATH" }],
      categories,
    );

    expect(result[0].catId).toBe("4.3.1");
  });

  it("rejects unknown and non-leaf categories", () => {
    expect(
      resolveSuggestedSkills(
        [
          { category_number: "4", category_name: "EDUCATION" },
          { category_number: "99", category_name: "UNKNOWN" },
        ],
        categories,
      ),
    ).toEqual([]);
  });

  it("rejects ambiguous category names", () => {
    const duplicateCategories = [
      ...categories,
      { catId: "9.1", catName: "MATH" },
    ];

    expect(
      resolveSuggestedSkills(
        [{ category_number: "unknown", category_name: "MATH" }],
        duplicateCategories,
      ),
    ).toEqual([]);
  });

  it("deduplicates repeated API suggestions", () => {
    const suggestion = {
      category_number: "4.3.1",
      category_name: "MATH",
    };

    expect(
      resolveSuggestedSkills([suggestion, suggestion], categories),
    ).toHaveLength(1);
  });

  it("supports direct and wrapped API responses", () => {
    const response = {
      categories: [],
      unmatched_skills: ["sports"],
      session: { entries: [] },
      cached: true,
    };

    expect(normalizeSkillSuggestionResponse(response)).toEqual(
      normalizeSkillSuggestionResponse({ body: response }),
    );
  });

  it("accepts an empty category response", () => {
    expect(
      normalizeSkillSuggestionResponse({ categories: [] }).categories,
    ).toEqual([]);
  });

  it("rejects malformed API responses", () => {
    expect(() => normalizeSkillSuggestionResponse({})).toThrow(
      "Invalid skill suggestion response",
    );
  });

  it("finds the General category", () => {
    expect(getGeneralSkill(categories).catId).toBe("general");
  });

  it("merges manual and AI skills without duplicates", () => {
    expect(
      mergeSelectedSkills(["4.3.1", "general"], ["4.3.1", "6.6", "6.6"]),
    ).toEqual(["4.3.1", "general", "6.6"]);
  });
});
