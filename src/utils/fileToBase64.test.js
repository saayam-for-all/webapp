import { fileToBase64, ACCEPTED_IMAGE_TYPES } from "./fileToBase64";

describe("fileToBase64", () => {
  const mockDataUrl = "data:image/jpeg;base64,/9j/4AAQ";

  beforeEach(() => {
    jest.clearAllMocks();
    global.FileReader = jest.fn().mockImplementation(function () {
      this.readAsDataURL = jest.fn(() => {
        setTimeout(() => {
          this.result = mockDataUrl;
          if (this.onload) this.onload({ target: this });
        }, 0);
      });
      this.onload = null;
      this.onerror = null;
    });
  });

  it("returns accepted image types as jpeg and png", () => {
    expect(ACCEPTED_IMAGE_TYPES).toEqual(["image/jpeg", "image/png"]);
  });

  it("resolves with data URL when given a valid jpeg File", async () => {
    const file = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    const result = await fileToBase64(file);
    expect(result).toBe(mockDataUrl);
    expect(result.startsWith("data:image/")).toBe(true);
    expect(result.includes("base64,")).toBe(true);
  });

  it("resolves with data URL when given a valid png File", async () => {
    const pngDataUrl = "data:image/png;base64,iVBORw0K";
    global.FileReader = jest.fn().mockImplementation(function () {
      this.readAsDataURL = jest.fn(() => {
        setTimeout(() => {
          this.result = pngDataUrl;
          if (this.onload) this.onload({ target: this });
        }, 0);
      });
      this.onload = null;
      this.onerror = null;
    });
    const file = new File(["x"], "photo.png", { type: "image/png" });
    const result = await fileToBase64(file);
    expect(result).toBe(pngDataUrl);
  });

  it("rejects when file type is not jpeg or png", async () => {
    const file = new File(["x"], "photo.gif", { type: "image/gif" });
    await expect(fileToBase64(file)).rejects.toThrow(
      "Only JPG and PNG formats are accepted.",
    );
  });

  it("rejects when file is null", async () => {
    await expect(fileToBase64(null)).rejects.toThrow("Invalid file");
  });

  it("rejects when file is not a File instance", async () => {
    await expect(
      fileToBase64({ name: "x", type: "image/jpeg" }),
    ).rejects.toThrow("Invalid file");
  });
});
