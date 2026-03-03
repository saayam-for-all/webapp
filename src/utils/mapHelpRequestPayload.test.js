import { mapHelpRequestPayload } from "./mapHelpRequestPayload";

const baseArgs = {
  formData: {
    subject: "Need food assistance",
    description: "Help with groceries",
    is_calamity: false,
    lead_volunteer: "Yes",
    priority: "MEDIUM",
    request_type: "REMOTE",
    is_self: "yes",
  },
  selectedCategoryId: "1.1",
  requesterId: "user-123",
  enumMaps: {
    requestPriority: { MEDIUM: 2 },
    requestType: { REMOTE: 1 },
    requestFor: { SELF: 1, OTHER: 2 },
  },
};

describe("mapHelpRequestPayload", () => {
  it("returns base payload without additionalFields when none provided", () => {
    const result = mapHelpRequestPayload(baseArgs);
    expect(result.requesterId).toBe("user-123");
    expect(result.requestSubject).toBe("Need food assistance");
    expect(result.helpCategory.catId).toBe("1.1");
    expect(result.additionalFields).toBeUndefined();
  });

  it("includes additionalFields when provided with values", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      additionalFields: { "1.1.A": "VEGETARIAN", "1.1.C": "4" },
    });
    expect(result.additionalFields).toEqual({
      "1.1.A": "VEGETARIAN",
      "1.1.C": "4",
    });
  });

  it("omits additionalFields when provided as empty object", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      additionalFields: {},
    });
    expect(result.additionalFields).toBeUndefined();
  });

  it("omits additionalFields when provided as null", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      additionalFields: null,
    });
    expect(result.additionalFields).toBeUndefined();
  });

  it("omits additionalFields when not provided at all", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      additionalFields: undefined,
    });
    expect(result.additionalFields).toBeUndefined();
  });

  it("maps is_self OTHER correctly", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      formData: { ...baseArgs.formData, is_self: "no" },
    });
    expect(result.requestFor.requestForId).toBe(2);
  });

  it("maps lead_volunteer No correctly", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      formData: { ...baseArgs.formData, lead_volunteer: "No" },
    });
    expect(result.isLeadVolunteer).toBe(0);
  });
});
