/* global process */
import { act, fireEvent, render, screen } from "@testing-library/react";
import RecaptchaProvider, { RECAPTCHA_BADGE_ID } from "./RecaptchaProvider";

const SITE_KEY = "test-site-key";

const mockGrecaptcha = () => {
  const grecaptcha = {
    render: jest.fn((containerId) => {
      const badge = document.createElement("div");
      badge.className = "grecaptcha-badge";
      document.getElementById(containerId).appendChild(badge);
      return 0;
    }),
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

  it("uses Google's bottom-left badge positioning", () => {
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

  it("keeps the badge container mounted when the page content changes", () => {
    const { rerender } = render(
      <RecaptchaProvider>
        <main>First page</main>
      </RecaptchaProvider>,
    );
    const badge = document.getElementById(RECAPTCHA_BADGE_ID);
    expect(badge).toBeTruthy();
    expect(document.querySelector("main").contains(badge)).toBe(false);

    rerender(
      <RecaptchaProvider>
        <main>Next page</main>
      </RecaptchaProvider>,
    );
    expect(document.getElementById(RECAPTCHA_BADGE_ID)).toBe(badge);
  });

  it("shows a compact badge that can be expanded and collapsed by tapping", async () => {
    render(
      <RecaptchaProvider>
        <main>Page content</main>
      </RecaptchaProvider>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    mockGrecaptcha();
    await act(async () => window.onRecaptchaLoadCallback());

    const toggle = screen.getByRole("button", {
      name: "Expand reCAPTCHA information",
    });
    const widget = document.querySelector(".grecaptcha-badge");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(
      screen
        .getByRole("button", { name: "Collapse reCAPTCHA information" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    expect(document.querySelector(".grecaptcha-badge")).toBe(widget);
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("collapses an expanded badge when the user taps elsewhere", async () => {
    render(
      <RecaptchaProvider>
        <main>Page content</main>
      </RecaptchaProvider>,
    );
    mockGrecaptcha();
    await act(async () => window.onRecaptchaLoadCallback());
    fireEvent.click(
      screen.getByRole("button", { name: "Expand reCAPTCHA information" }),
    );
    fireEvent.pointerDown(screen.getByText("Page content"));
    expect(
      screen
        .getByRole("button", { name: "Expand reCAPTCHA information" })
        .getAttribute("aria-expanded"),
    ).toBe("false");
  });
});
