/* global process */
import { render, screen } from "@testing-library/react";
import RecaptchaProvider, { RECAPTCHA_BADGE_ID } from "./RecaptchaProvider";

const SITE_KEY = "test-site-key";

const mockGrecaptcha = () => {
  const grecaptcha = {
    render: jest.fn(() => 0),
    ready: jest.fn((callback) => callback()),
    execute: jest.fn(),
  };
  window.grecaptcha = grecaptcha;
  return grecaptcha;
};

describe("RecaptchaProvider", () => {
  beforeEach(() => {
    process.env.VITE_RECAPTCHA_SITE_KEY = SITE_KEY;
  });

  afterEach(() => {
    delete process.env.VITE_RECAPTCHA_SITE_KEY;
    delete window.grecaptcha;
    delete window.onRecaptchaLoadCallback;
    document.getElementById("google-recaptcha-v3")?.remove();
  });

  it("renders the application inside the provider", () => {
    render(
      <RecaptchaProvider>
        <p>app content</p>
      </RecaptchaProvider>,
    );

    expect(screen.getByText("app content")).toBeTruthy();
  });

  it("renders the badge container so Google can mount into it", () => {
    render(
      <RecaptchaProvider>
        <p>app content</p>
      </RecaptchaProvider>,
    );

    expect(document.getElementById(RECAPTCHA_BADGE_ID)).toBeTruthy();
  });

  it("loads reCAPTCHA in explicit mode so the badge position can be configured", () => {
    render(
      <RecaptchaProvider>
        <p>app content</p>
      </RecaptchaProvider>,
    );

    const script = document.getElementById("google-recaptcha-v3");
    expect(script).toBeTruthy();
    expect(script.getAttribute("src")).toContain("render=explicit");
  });

  it("renders the badge at the bottom-left, away from the scroll-to-top button", () => {
    render(
      <RecaptchaProvider>
        <p>app content</p>
      </RecaptchaProvider>,
    );
    const grecaptcha = mockGrecaptcha();

    window.onRecaptchaLoadCallback();

    expect(grecaptcha.render).toHaveBeenCalledWith(
      RECAPTCHA_BADGE_ID,
      expect.objectContaining({
        sitekey: SITE_KEY,
        size: "invisible",
        badge: "bottomleft",
      }),
    );
  });
});
