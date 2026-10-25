import { stewardReviewRequestsMockData } from "./data";

const ALLOWED_STATUSES = ["VOLUNTEER_NOT_FOUND", "VOLUNTEER_REASSIGNMENT"];
const REQUIRED_FIELDS = [
  "requestId",
  "subject",
  "requestCategory",
  "status",
  "priority",
  "updatedDate",
  "creationDate",
  "beneficiaryId",
  "requesterId",
];

describe("stewardReviewRequestsMockData", () => {
  it("exports an array with at least 10 records", () => {
    expect(Array.isArray(stewardReviewRequestsMockData)).toBe(true);
    expect(stewardReviewRequestsMockData.length).toBeGreaterThanOrEqual(10);
  });

  it("contains only the two allowed steward status values", () => {
    const statuses = [
      ...new Set(stewardReviewRequestsMockData.map((r) => r.status)),
    ];
    expect(statuses.sort()).toEqual([...ALLOWED_STATUSES].sort());
  });

  it("includes at least one record with each allowed status", () => {
    ALLOWED_STATUSES.forEach((status) => {
      expect(
        stewardReviewRequestsMockData.some((r) => r.status === status),
      ).toBe(true);
    });
  });

  it("every record has all required fields defined", () => {
    stewardReviewRequestsMockData.forEach((record, idx) => {
      REQUIRED_FIELDS.forEach((field) => {
        // Use a descriptive failing message via toBeDefined on the value
        const value = record[field];
        if (value === undefined) {
          throw new Error(
            `record[${idx}] (${record.requestId}) is missing required field "${field}"`,
          );
        }
      });
    });
  });

  it("every requestId is unique", () => {
    const ids = stewardReviewRequestsMockData.map((r) => r.requestId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every updatedDate is a valid ISO date string", () => {
    stewardReviewRequestsMockData.forEach((record) => {
      const date = new Date(record.updatedDate);
      expect(Number.isNaN(date.getTime())).toBe(false);
    });
  });
});
