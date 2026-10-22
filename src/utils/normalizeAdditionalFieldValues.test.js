import {
  extractAdditionalFieldsFromResponse,
  normalizeAdditionalFieldValues,
} from "./normalizeAdditionalFieldValues";

const dateTimeMetadata = [
  {
    catId: "3.7",
    fields: [
      {
        fieldId: "3.7.B",
        fieldNameKey: "ESTIMATED_MOVING_DATE",
        fieldType: "date&time",
        status: "active",
        listItems: [],
      },
      {
        fieldId: "3.7.C",
        fieldNameKey: "NUMBER_OF_HELPERS",
        fieldType: "integer",
        status: "active",
        listItems: [],
      },
    ],
  },
];

describe("extractAdditionalFieldsFromResponse", () => {
  it("returns nested additionalFields when present", () => {
    expect(
      extractAdditionalFieldsFromResponse({
        success: true,
        data: {
          requestId: "REQ-1",
          reqCatId: "3.7",
          additionalFields: {
            "3.7.C": "4",
          },
        },
      }),
    ).toEqual({ "3.7.C": "4" });
  });

  it("returns a flat field map when data is already grouped at the top level", () => {
    expect(
      extractAdditionalFieldsFromResponse({
        data: {
          "3.7.B": "2026-06-13T04:00:00Z",
          "3.7.C": "4",
        },
      }),
    ).toEqual({
      "3.7.B": "2026-06-13T04:00:00Z",
      "3.7.C": "4",
    });
  });

  it("strips request metadata keys from legacy wrapped payloads", () => {
    expect(
      extractAdditionalFieldsFromResponse({
        data: {
          requestId: "REQ-1",
          reqCatId: "3.7",
          "3.7.C": "4",
        },
      }),
    ).toEqual({ "3.7.C": "4" });
  });

  it("returns an empty object for invalid response payloads", () => {
    expect(extractAdditionalFieldsFromResponse({ data: "invalid" })).toEqual(
      {},
    );
    expect(extractAdditionalFieldsFromResponse({ data: [] })).toEqual({});
    expect(extractAdditionalFieldsFromResponse("invalid")).toEqual({});
  });
});

describe("normalizeAdditionalFieldValues", () => {
  it("returns an empty object for null, undefined, or non-object values", () => {
    expect(normalizeAdditionalFieldValues(null, dateTimeMetadata)).toEqual({});
    expect(normalizeAdditionalFieldValues(undefined, dateTimeMetadata)).toEqual(
      {},
    );
    expect(normalizeAdditionalFieldValues([], dateTimeMetadata)).toEqual({});
    expect(normalizeAdditionalFieldValues("value", dateTimeMetadata)).toEqual(
      {},
    );
  });

  it("passes through non date-time fields unchanged", () => {
    const values = { "3.7.C": "4", "3.7.D": "hello" };

    expect(normalizeAdditionalFieldValues(values, dateTimeMetadata)).toEqual(
      values,
    );
  });

  it("splits ISO date-time values for date&time fields", () => {
    const result = normalizeAdditionalFieldValues(
      {
        "3.7.B": "2026-06-13T04:00:00Z",
        "3.7.C": "4",
      },
      dateTimeMetadata,
    );

    expect(result).toEqual({
      "3.7.B": {
        "3.7.B_date": "2026-06-13",
        "3.7.B_time": "04:00",
      },
      "3.7.C": "4",
    });
  });

  it("passes through date-time values when ISO parsing fails", () => {
    const values = { "3.7.B": "not-a-date" };

    expect(normalizeAdditionalFieldValues(values, dateTimeMetadata)).toEqual(
      values,
    );
  });

  it("passes through ISO strings when metadata has no matching date&time field", () => {
    const values = { "9.9.Z": "2026-06-13T04:00:00Z" };

    expect(normalizeAdditionalFieldValues(values, dateTimeMetadata)).toEqual(
      values,
    );
  });

  it("handles missing or malformed metadata gracefully", () => {
    const values = { "3.7.C": "4" };

    expect(normalizeAdditionalFieldValues(values, null)).toEqual(values);
    expect(normalizeAdditionalFieldValues(values, undefined)).toEqual(values);
    expect(normalizeAdditionalFieldValues(values, [{}])).toEqual(values);
    expect(normalizeAdditionalFieldValues(values, [{ fields: null }])).toEqual(
      values,
    );
  });

  it("normalizes multiple fields across metadata entries", () => {
    const metadata = [
      {
        catId: "1.1",
        fields: [
          {
            fieldId: "1.1.A",
            fieldType: "date&time",
          },
        ],
      },
      {
        catId: "2.2",
        fields: [
          {
            fieldId: "2.2.B",
            fieldType: "text",
          },
        ],
      },
    ];

    expect(
      normalizeAdditionalFieldValues(
        {
          "1.1.A": "2025-01-20T15:45:00",
          "2.2.B": "notes",
        },
        metadata,
      ),
    ).toEqual({
      "1.1.A": {
        "1.1.A_date": "2025-01-20",
        "1.1.A_time": "15:45",
      },
      "2.2.B": "notes",
    });
  });
});
