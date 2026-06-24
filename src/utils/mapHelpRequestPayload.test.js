import { mapHelpRequestPayload } from "./mapHelpRequestPayload";

const baseEnumMaps = {
  requestPriority: { MEDIUM: 2, HIGH: 1 },
  requestType: { REMOTE: 1, IN_PERSON: 2 },
  requestFor: { SELF: 1, OTHER: 2 },
};

const baseFormData = {
  subject: "Test Subject",
  description: "Test Description",
  is_calamity: false,
  lead_volunteer: "No",
  priority: "MEDIUM",
  request_type: "REMOTE",
  request_for: "SELF",
};

const baseArgs = {
  formData: baseFormData,
  selectedCategoryId: "1.2.3.4.5",
  requesterId: "req-123",
  enumMaps: baseEnumMaps,
};

describe("mapHelpRequestPayload", () => {
  it("maps basic payload with all required fields", () => {
    const result = mapHelpRequestPayload(baseArgs);

    expect(result).toEqual({
      requesterId: "req-123",
      requestSubject: "Test Subject",
      requestDescription: "Test Description",
      isCalamity: false,
      isLeadVolunteer: 0,
      requestPriority: { requestPriorityId: 2 },
      requestType: { requestTypeId: 1 },
      helpCategory: { catId: "1.2.3.4.5" },
      requestFor: { requestForId: 1 },
    });
  });

  it("includes requestId when provided (edit mode)", () => {
    const result = mapHelpRequestPayload({ ...baseArgs, requestId: "rid-456" });

    expect(result.requestId).toBe("rid-456");
  });

  it("does not include requestId when not provided (create mode)", () => {
    const result = mapHelpRequestPayload(baseArgs);

    expect(result).not.toHaveProperty("requestId");
  });

  it("includes requestLocation as coordinates when locationCoordinates provided", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      formData: {
        ...baseFormData,
        location: "New York, NY",
        locationCoordinates: { latitude: 40.7128, longitude: -74.006 },
      },
    });

    expect(result.requestLocation).toBe("latitude:40.7128,longitude:-74.006");
  });

  it("includes requestLocation as string when no locationCoordinates provided", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      formData: { ...baseFormData, location: "New York, NY" },
    });

    expect(result.requestLocation).toBe("New York, NY");
  });

  it("maps GENERAL_CATEGORY to catId '0.0.0.0.0'", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      selectedCategoryId: "GENERAL_CATEGORY",
    });

    expect(result.helpCategory.catId).toBe("0.0.0.0.0");
  });

  it("maps 'General' string to catId '0.0.0.0.0'", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      selectedCategoryId: "General",
    });

    expect(result.helpCategory.catId).toBe("0.0.0.0.0");
  });

  it("includes guestDetails when requestFor is OTHER", () => {
    const formData = {
      ...baseFormData,
      request_for: "OTHER",
      requester_first_name: "Jane",
      requester_last_name: "Doe",
      email: "jane@example.com",
      phone: "555-1234",
      age: "30",
      gender: "Female",
      preferred_language: "English",
    };

    const result = mapHelpRequestPayload({ ...baseArgs, formData });

    expect(result.guestDetails).toEqual({
      reqFname: "Jane",
      reqLname: "Doe",
      reqEmail: "jane@example.com",
      reqPhone: "555-1234",
      reqAge: 30,
      reqGender: "Female",
      reqPrefLang: "English",
    });
  });

  it("includes additionalFields when non-empty object provided", () => {
    const additionalFields = { customField: "value" };

    const result = mapHelpRequestPayload({ ...baseArgs, additionalFields });

    expect(result.additionalFields).toEqual({ customField: "value" });
  });

  it("does not include additionalFields when empty object provided", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      additionalFields: {},
    });

    expect(result).not.toHaveProperty("additionalFields");
  });

  it("includes audioRequestDescription when provided", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      formData: { ...baseFormData, audioRequestDescription: "audio-uuid" },
    });

    expect(result.audioRequestDescription).toBe("audio-uuid");
  });

  it("falls back to SELF when request_for value does not match any enum key", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      formData: { ...baseFormData, request_for: "INVALID_VALUE" },
    });

    expect(result.requestFor.requestForId).toBe(baseEnumMaps.requestFor.SELF);
  });

  it("includes requestDocumentLink when provided", () => {
    const result = mapHelpRequestPayload({
      ...baseArgs,
      formData: { ...baseFormData, requestDocumentLink: "doc-link" },
    });

    expect(result.requestDocumentLink).toBe("doc-link");
  });
});
