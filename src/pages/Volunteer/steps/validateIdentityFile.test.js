import { validateIdentityFile, MAX_ID_FILE_SIZE } from "./validateIdentityFile";

const signatures = {
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  jpeg: [0xff, 0xd8, 0xff, 0xe0],
  pdf: [0x25, 0x50, 0x44, 0x46, 0x2d],
};

const createFile = (bytes, name, type) =>
  new File([new Uint8Array(bytes)], name, { type });

describe("Issue #1996 - Identity file validation", () => {
  it.each([
    ["PNG", signatures.png, "identity.png", "image/png"],
    ["JPEG", signatures.jpeg, "identity.jpg", "image/jpeg"],
    ["JPEG extension", signatures.jpeg, "identity.jpeg", "image/jpeg"],
    ["PDF", signatures.pdf, "identity.pdf", "application/pdf"],
  ])("accepts a valid %s signature", async (_, bytes, name, type) => {
    expect(
      await validateIdentityFile(createFile(bytes, name, type)),
    ).toBeNull();
  });

  it("rejects an empty file", async () => {
    const file = createFile([], "identity.png", "image/png");
    expect(await validateIdentityFile(file)).toBe("empty");
  });

  it("rejects files larger than 5 MB", async () => {
    const file = createFile(
      new Uint8Array(MAX_ID_FILE_SIZE + 1),
      "identity.png",
      "image/png",
    );
    expect(await validateIdentityFile(file)).toBe("size");
  });

  it("rejects unsupported extensions", async () => {
    const file = createFile(signatures.png, "identity.txt", "image/png");
    expect(await validateIdentityFile(file)).toBe("type");
  });

  it("rejects mismatched MIME types", async () => {
    const file = createFile(signatures.png, "identity.png", "application/pdf");
    expect(await validateIdentityFile(file)).toBe("type");
  });

  it("rejects fake PNG content", async () => {
    const file = new File(["not an image"], "identity.png", {
      type: "image/png",
    });
    expect(await validateIdentityFile(file)).toBe("content");
  });

  it("rejects fake PDF content", async () => {
    const file = new File(["not a PDF"], "identity.pdf", {
      type: "application/pdf",
    });
    expect(await validateIdentityFile(file)).toBe("content");
  });

  it("rejects PNG bytes renamed as PDF", async () => {
    const file = createFile(signatures.png, "identity.pdf", "application/pdf");
    expect(await validateIdentityFile(file)).toBe("content");
  });

  it("accepts uppercase extensions", async () => {
    const file = createFile(signatures.png, "IDENTITY.PNG", "image/png");
    expect(await validateIdentityFile(file)).toBeNull();
  });
});
