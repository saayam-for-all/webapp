import axios from "axios";
import endpoints from "./endpoints.json";
import { sendContactEmail } from "./contactServices";

jest.mock("axios");
jest.mock("./api", () => ({
  publicApi: {},
}));

describe("contactServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("posts mapped payload to contact endpoint and returns response data", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    const result = await sendContactEmail({
      firstName: "Jane",
      lastName: "Doe",
      middleName: "",
      email: "jane@example.com",
      phone: "+12025550100",
      message: "Need help",
      reason: "General",
      recaptchaToken: "captcha-token",
    });

    expect(axios.post).toHaveBeenCalledWith(endpoints.SEND_CONTACT_EMAIL, {
      email: "jane@example.com",
      name: "Jane Doe",
      middleName: "",
      phone: "+12025550100",
      message: "Need help",
      reason: "General",
      recaptchaToken: "captcha-token",
    });
    expect(result).toEqual({ success: true });
  });

  it("propagates axios errors", async () => {
    axios.post.mockRejectedValue(new Error("Network error"));

    await expect(
      sendContactEmail({
        firstName: "Jane",
        lastName: "Doe",
        middleName: "",
        email: "jane@example.com",
        phone: "+12025550100",
        message: "Need help",
        reason: "General",
        recaptchaToken: "captcha-token",
      }),
    ).rejects.toThrow("Network error");
  });
});
