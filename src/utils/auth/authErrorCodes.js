export const AUTH_ERROR_CODES = {
  SIGNUP_FAILED_NATIVE_EXISTS: "SIGNUP_FAILED_NATIVE_EXISTS",
  SIGNUP_FAILED_SOCIAL_EXISTS: "SIGNUP_FAILED_SOCIAL_EXISTS",
  SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS: "SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS",
  SOCIAL_SIGNIN_BLOCKED_DIFFERENT_PROVIDER_EXISTS:
    "SOCIAL_SIGNIN_BLOCKED_DIFFERENT_PROVIDER_EXISTS",
};

/**
 * The Pre-Signup Lambda rejects duplicate accounts with an error code embedded
 * in the message, e.g. "PreSignUp failed with error SIGNUP_FAILED_SOCIAL_EXISTS."
 * Accepts an Error or a raw message string and returns the matching code, or
 * null when the error is not one of the known duplicate-account codes.
 */
export const getAuthErrorCode = (errorOrMessage) => {
  const message =
    typeof errorOrMessage === "string"
      ? errorOrMessage
      : String(errorOrMessage?.message ?? "");
  return (
    Object.values(AUTH_ERROR_CODES).find((code) => message.includes(code)) ??
    null
  );
};

export const OAUTH_ERROR_CODES = {
  SIGNIN_FAILED: "OAUTH_SIGNIN_FAILED",
};

/**
 * i18n keys for the error banner on the login page, keyed by the `authError`
 * value passed through router state.
 */
export const LOGIN_ERROR_MESSAGE_KEYS = {
  [AUTH_ERROR_CODES.SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS]:
    "auth:login.social_blocked_native_exists",
  [AUTH_ERROR_CODES.SOCIAL_SIGNIN_BLOCKED_DIFFERENT_PROVIDER_EXISTS]:
    "auth:login.social_blocked_different_provider_exists",
  [OAUTH_ERROR_CODES.SIGNIN_FAILED]: "auth:login.oauth_signin_failed",
};

/**
 * Classifies the `error_description` Cognito puts on the redirect URL after a
 * failed social sign-in. Amplify only surfaces it when an `error` param is also
 * present, so the URL is the reliable source. Anything that is not a known
 * duplicate-account code falls back to a generic sign-in failure.
 */
export const getOAuthRedirectErrorCode = (message) =>
  getAuthErrorCode(message) ?? OAUTH_ERROR_CODES.SIGNIN_FAILED;

/**
 * Path to send the user to when Cognito redirected back with an OAuth error in
 * the URL, or null for any other URL. Used by a route loader so the redirect
 * happens before any protected page renders.
 */
export const getOAuthErrorRedirectPath = (url) => {
  const params = new URL(url).searchParams;
  const message = params.get("error_description") ?? params.get("error");
  return message
    ? `/login?authError=${getOAuthRedirectErrorCode(message)}`
    : null;
};
