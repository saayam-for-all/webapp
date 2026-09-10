/* global process */
import axios from "axios";
import { sendContactEmail } from "./contactServices";

jest.mock("axios");

const CONTACT_URL =
  "https://example.execute-api.us-east-1.amazonaws.com/dev/sendContactEmail";

const validInput = {
  firstName: "Jane",
  lastName: "Doe",
  middleName: "",
  email: "jane@example.com",
  phone: "+12025550100",
  message: "Need help",
  reason: "General",
  recaptchaToken: "captcha-token",
};

describe("contactServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.VITE_CONTACT_API_URL = CONTACT_URL;
  });

  afterEach(() => {
    delete process.env.VITE_CONTACT_API_URL;
  });

  it("posts mapped payload to the configured endpoint and returns response data", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    const result = await sendContactEmail(validInput);

    expect(axios.post).toHaveBeenCalledWith(
      CONTACT_URL,
      {
        email: "jane@example.com",
        name: "Jane Doe",
        middleName: "",
        phone: "+12025550100",
        message: "Need help",
        reason: "General",
        recaptchaToken: "captcha-token",
      },
      { timeout: 15000 },
    );
    expect(result).toEqual({ success: true });
  });

  it("throws a controlled error when the endpoint is not configured", async () => {
    delete process.env.VITE_CONTACT_API_URL;

    await expect(sendContactEmail(validInput)).rejects.toThrow(
      "Contact service is not configured",
    );
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("propagates axios errors", async () => {
    axios.post.mockRejectedValue(new Error("Network error"));

    await expect(sendContactEmail(validInput)).rejects.toThrow("Network error");
  });
});
