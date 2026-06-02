export const AUTH_PROVIDER_STORAGE_KEY = "authProvider";
export const LINKEDIN_OAUTH_LOGOUT_URL =
  "https://www.linkedin.com/oauth/v2/logout";
export const LINKEDIN_MEMBER_LOGOUT_URL = "https://www.linkedin.com/m/logout/";

export const parseAuthProviderFromAttributes = (attributes) => {
  if (!attributes?.identities) return null;
  try {
    const identities = JSON.parse(attributes.identities);
    return identities?.[0]?.providerName ?? null;
  } catch {
    return null;
  }
};

export const isLinkedInAuthProvider = (providerName) =>
  typeof providerName === "string" && providerName.toLowerCase() === "linkedin";

export const persistAuthProvider = (providerName) => {
  if (providerName) {
    sessionStorage.setItem(AUTH_PROVIDER_STORAGE_KEY, providerName);
  } else {
    sessionStorage.removeItem(AUTH_PROVIDER_STORAGE_KEY);
  }
};

export const getPersistedAuthProvider = () =>
  sessionStorage.getItem(AUTH_PROVIDER_STORAGE_KEY);

export const clearPersistedAuthProvider = () => {
  sessionStorage.removeItem(AUTH_PROVIDER_STORAGE_KEY);
};

/**
 * LinkedIn OIDC logout clears the member session so Cognito does not silently
 * re-authenticate on the next sign-in attempt.
 * @see https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2
 */
export const getLinkedInLogoutUrl = (
  returnTo = `${window.location.origin}/login`,
) => {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  if (clientId) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: returnTo,
    });
    return `${LINKEDIN_OAUTH_LOGOUT_URL}?${params.toString()}`;
  }
  return LINKEDIN_MEMBER_LOGOUT_URL;
};

export const redirectToLinkedInLogout = () => {
  window.location.assign(getLinkedInLogoutUrl());
};
