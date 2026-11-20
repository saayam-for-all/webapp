import {
  AUTH_ERROR_CODES,
  getAuthErrorCode,
  getOAuthErrorRedirectPath,
  getOAuthRedirectErrorCode,
} from "./authErrorCodes";

describe("getAuthErrorCode", () => {
  it.each(Object.values(AUTH_ERROR_CODES))(
    "extracts %s from an Error and from a string",
    (code) => {
      const message = `PreSignUp failed with error ${code}.`;
      expect(getAuthErrorCode(new Error(message))).toBe(code);
      expect(getAuthErrorCode(message)).toBe(code);
    },
  );

  it("returns null for unknown or empty input", () => {
    expect(getAuthErrorCode(new Error("something else"))).toBeNull();
    expect(getAuthErrorCode(undefined)).toBeNull();
    expect(getAuthErrorCode(null)).toBeNull();
  });
});

describe("getOAuthRedirectErrorCode", () => {
  it("keeps known backend codes", () => {
    expect(
      getOAuthRedirectErrorCode(
        "PreSignUp failed with error SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS.",
      ),
    ).toBe("SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS");
  });

  it("falls back to a generic sign-in failure", () => {
    expect(getOAuthRedirectErrorCode("access_denied")).toBe(
      "OAUTH_SIGNIN_FAILED",
    );
    expect(getOAuthRedirectErrorCode("attributes required: [email]")).toBe(
      "OAUTH_SIGNIN_FAILED",
    );
  });
});

describe("getOAuthErrorRedirectPath", () => {
  const base = "http://localhost:5173/dashboard";

  it("redirects a different existing social provider to login", () => {
    expect(
      getOAuthErrorRedirectPath(
        `${base}?error_description=PreSignUp+failed+with+error+SOCIAL_SIGNIN_BLOCKED_DIFFERENT_PROVIDER_EXISTS.&state=abc`,
      ),
    ).toBe("/login?authError=SOCIAL_SIGNIN_BLOCKED_DIFFERENT_PROVIDER_EXISTS");
  });

  it("uses the generic code when the provider returns no email", () => {
    expect(
      getOAuthErrorRedirectPath(
        `${base}?error_description=attributes+required%3A+%5Bemail%5D&state=abc`,
      ),
    ).toBe("/login?authError=OAUTH_SIGNIN_FAILED");
  });

  it("redirects a blocked native account to login", () => {
    expect(
      getOAuthErrorRedirectPath(
        `${base}?error=invalid_request&error_description=PreSignUp+failed+with+error+SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS.`,
      ),
    ).toBe("/login?authError=SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS");
  });

  it("uses the generic code for other errors", () => {
    expect(getOAuthErrorRedirectPath(`${base}?error=access_denied`)).toBe(
      "/login?authError=OAUTH_SIGNIN_FAILED",
    );
  });

  it("returns null when there is no OAuth error", () => {
    expect(getOAuthErrorRedirectPath(base)).toBeNull();
    expect(getOAuthErrorRedirectPath(`${base}?code=abc&state=xyz`)).toBeNull();
  });
});
