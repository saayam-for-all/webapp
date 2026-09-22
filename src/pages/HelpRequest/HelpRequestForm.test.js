import { waitForGeneratedSubject } from "./waitForGeneratedSubject";

describe("waitForGeneratedSubject", () => {
  it("returns true immediately when subject exists", async () => {
    const result = await waitForGeneratedSubject(() => "Need groceries", {
      timeoutMs: 50,
      pollIntervalMs: 5,
    });

    expect(result).toBe(true);
  });

  it("waits for subject to be generated before timing out", async () => {
    let subject = "";
    setTimeout(() => {
      subject = "Need lease review";
    }, 15);

    const result = await waitForGeneratedSubject(() => subject, {
      timeoutMs: 80,
      pollIntervalMs: 5,
    });

    expect(result).toBe(true);
  });

  it("returns false when subject is still empty after timeout", async () => {
    const result = await waitForGeneratedSubject(() => "", {
      timeoutMs: 20,
      pollIntervalMs: 5,
    });

    expect(result).toBe(false);
  });
});
