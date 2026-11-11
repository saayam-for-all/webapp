import {
  getCachedOrganizations,
  cacheOrganizations,
  clearOrganizationsCache,
} from "./organizationCache";

describe("organizationCache", () => {
  beforeEach(() => {
    clearOrganizationsCache();
  });

  it("stores and retrieves organizations for a request", () => {
    const organizations = [{ Name: "Helping Hands" }];

    cacheOrganizations("REQ-1", "USER-1", organizations);

    expect(getCachedOrganizations("REQ-1", "USER-1")).toEqual(organizations);
  });

  it("keeps results separate for different requests", () => {
    cacheOrganizations("REQ-1", "USER-1", [{ Name: "Org A" }]);
    cacheOrganizations("REQ-2", "USER-1", [{ Name: "Org B" }]);

    expect(getCachedOrganizations("REQ-1", "USER-1")).toEqual([
      { Name: "Org A" },
    ]);
    expect(getCachedOrganizations("REQ-2", "USER-1")).toEqual([
      { Name: "Org B" },
    ]);
  });

  it("keeps results separate for different beneficiaries", () => {
    cacheOrganizations("REQ-1", "USER-1", [{ Name: "Org A" }]);

    expect(getCachedOrganizations("REQ-1", "USER-2")).toBeUndefined();
  });

  it("clears cached results", () => {
    cacheOrganizations("REQ-1", "USER-1", []);

    clearOrganizationsCache();

    expect(getCachedOrganizations("REQ-1", "USER-1")).toBeUndefined();
  });
});
