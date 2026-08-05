import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Provider name for LinkedIn as configured in the Cognito user pool.
 */
export const LINKEDIN_PROVIDER_NAME = "linkedin";

/**
 * Cognito federates to LinkedIn through an Auth0 tenant, so a LinkedIn user has
 * FOUR sessions, not two:
 *
 *   Amplify tokens -> Cognito cookie -> Auth0 cookie -> LinkedIn cookie
 *
 * signOut() clears the first two. Testing in a clean browser profile confirmed
 * that BOTH remaining sessions must be cleared: with the Auth0 session alive it
 * re-issues an assertion without contacting LinkedIn, and with the LinkedIn
 * session alive Auth0 simply re-asks LinkedIn, which answers silently.
 *
 * Auth0's ?federated parameter does NOT clear LinkedIn (LinkedIn publishes no
 * OIDC end_session_endpoint), so LinkedIn has to be visited separately.
 *
 * Order matters: Auth0 first (it can return the browser to us), LinkedIn last
 * (it cannot).
 */
export const AUTH0_DOMAIN = "dev-gdkev2n8pc4az5uh.us.auth0.com";
export const AUTH0_CLIENT_ID = "GyMTjvWIZXBpoLJvgXoVW9G6U0beVUVD";

/**
 * Auth0 returns the browser here after clearing its session. Auth0 rejects any
 * returnTo that is not in the application's Allowed Logout URLs, and /login is
 * the path already registered for both localhost and the Netlify deployment,
 * so the chain reuses it rather than depending on additional configuration.
 */
export const AUTH0_LOGOUT_RETURN_PATH = "/login";

/** LinkedIn's own web logout. Terminal - it cannot return the user to us. */
export const LINKEDIN_LOGOUT_URL = "https://www.linkedin.com/m/logout/";

/**
 * Tracks which stage of the logout chain we are in. Because every hop returns
 * the browser to /login, the URL alone cannot tell us whether Auth0 still needs
 * clearing, so the stage is held here. sessionStorage is per-tab, survives the
 * redirect round trips, and is not wiped by the localStorage cleanup that
 * logout performs.
 */
export const PENDING_LINKEDIN_LOGOUT_KEY = "pendingLinkedInLogout";

/** Auth0 has yet to be cleared. */
export const LOGOUT_STAGE_AUTH0 = "auth0";

/** Auth0 is done; LinkedIn is the final hop. */
export const LOGOUT_STAGE_LINKEDIN = "linkedin";

/**
 * True once a hop has been started during THIS page load.
 *
 * React StrictMode runs effects twice in development. Without this guard the
 * second invocation reads the stage the first one just advanced to and fires
 * the next hop immediately, which cancels the in-flight navigation. A real
 * navigation reloads the module, so this resets naturally on the next page.
 */
let redirectStarted = false;

/** Test-only: reset the per-page-load guard. */
export const resetLogoutRedirectGuard = () => {
  redirectStarted = false;
};

const normalize = (value) => String(value ?? "").toLowerCase();

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const buildAuth0LogoutUrl = (origin = window.location.origin) => {
  const returnTo = encodeURIComponent(`${origin}${AUTH0_LOGOUT_RETURN_PATH}`);
  return `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${returnTo}`;
};

/**
 * True when the currently signed-in user authenticated through LinkedIn.
 * MUST be called before signOut(), because the ID token is gone afterwards.
 */
export const isLinkedInSession = async () => {
  try {
    const session = await fetchAuthSession();
    const payload = session?.tokens?.idToken?.payload;

    if (!payload) {
      return false;
    }

    const rawIdentities = payload.identities ?? payload["cognito:identities"];
    const identities =
      typeof rawIdentities === "string"
        ? safeParse(rawIdentities)
        : rawIdentities;

    if (Array.isArray(identities)) {
      return identities.some(
        (identity) =>
          normalize(identity?.providerName) === LINKEDIN_PROVIDER_NAME,
      );
    }

    // Fallback: federated Cognito usernames look like "linkedin_linkedin|abc".
    return normalize(payload["cognito:username"]).startsWith(
      `${LINKEDIN_PROVIDER_NAME}_`,
    );
  } catch (error) {
    console.warn("Unable to resolve auth provider before logout:", error);
    return false;
  }
};

export const markLinkedInLogoutPending = () => {
  try {
    window.sessionStorage.setItem(
      PENDING_LINKEDIN_LOGOUT_KEY,
      LOGOUT_STAGE_AUTH0,
    );
  } catch {
    // sessionStorage can be unavailable (private mode / blocked storage).
    // Losing the flag only means the IdP sessions stay alive, which is the
    // pre-existing behaviour, so fail quietly rather than blocking logout.
  }
};

export const clearLinkedInLogoutPending = () => {
  try {
    window.sessionStorage.removeItem(PENDING_LINKEDIN_LOGOUT_KEY);
  } catch {
    // no-op
  }
};

export const getLinkedInLogoutStage = () => {
  try {
    return window.sessionStorage.getItem(PENDING_LINKEDIN_LOGOUT_KEY);
  } catch {
    return null;
  }
};

export const isLinkedInLogoutPending = () => getLinkedInLogoutStage() !== null;

/**
 * Steps 2 and 3 of the logout chain, driven by the stage flag. Each hop returns
 * the browser to /login, where this runs again for the next stage:
 *
 *   stage "auth0"    -> Auth0 /v2/logout  (returns to /login)
 *   stage "linkedin" -> LinkedIn /m/logout (terminal, cannot return)
 *
 * The stage is advanced BEFORE navigating so a re-render (React StrictMode runs
 * effects twice in dev) or a back-button press cannot repeat a hop.
 *
 * @returns {boolean} true if a redirect was started, so callers can bail out.
 */
export const completePendingLinkedInLogout = () => {
  // A hop is already navigating; do not start another and cancel it.
  if (redirectStarted) {
    return true;
  }

  const stage = getLinkedInLogoutStage();

  if (stage === LOGOUT_STAGE_AUTH0) {
    try {
      window.sessionStorage.setItem(
        PENDING_LINKEDIN_LOGOUT_KEY,
        LOGOUT_STAGE_LINKEDIN,
      );
    } catch {
      // If the stage cannot be persisted the chain would loop on Auth0, so
      // stop here rather than redirect. The app session is already cleared.
      return false;
    }

    redirectStarted = true;
    window.location.assign(buildAuth0LogoutUrl());
    return true;
  }

  if (stage === LOGOUT_STAGE_LINKEDIN) {
    clearLinkedInLogoutPending();
    redirectStarted = true;
    window.location.assign(LINKEDIN_LOGOUT_URL);
    return true;
  }

  return false;
};
