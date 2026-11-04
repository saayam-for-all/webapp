import {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  LINKEDIN_LOGOUT_URL,
  buildAuth0LogoutUrl,
  LOGOUT_STAGE_LINKEDIN,
  PENDING_LINKEDIN_LOGOUT_KEY,
  completePendingLinkedInLogout,
  isLinkedInLogoutPending,
  isLinkedInSession,
  markLinkedInLogoutPending,
  resetLogoutRedirectGuard,
} from "./linkedInLogout";

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn(),
}));

const { fetchAuthSession } = require("aws-amplify/auth");

const sessionWithIdentities = (payload) => ({
  tokens: { idToken: { payload } },
});

describe("linkedInLogout", () => {
  let assignMock;

  beforeEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.clear();
    resetLogoutRedirectGuard();

    assignMock = jest.fn();
    delete window.location;
    window.location = {
      assign: assignMock,
      href: "",
      origin: "http://localhost",
    };
  });

  describe("isLinkedInSession", () => {
    it("detects a LinkedIn user from the identities claim", async () => {
      fetchAuthSession.mockResolvedValue(
        sessionWithIdentities({
          identities: [{ providerName: "LinkedIn", userId: "abc" }],
        }),
      );

      await expect(isLinkedInSession()).resolves.toBe(true);
    });

    it("detects a LinkedIn user when identities is a JSON string", async () => {
      fetchAuthSession.mockResolvedValue(
        sessionWithIdentities({
          identities: JSON.stringify([{ providerName: "LinkedIn" }]),
        }),
      );

      await expect(isLinkedInSession()).resolves.toBe(true);
    });

    it("detects a LinkedIn user from the cognito:identities claim", async () => {
      fetchAuthSession.mockResolvedValue(
        sessionWithIdentities({
          "cognito:identities": [{ providerName: "linkedin" }],
        }),
      );

      await expect(isLinkedInSession()).resolves.toBe(true);
    });

    it("falls back to the federated cognito:username prefix", async () => {
      fetchAuthSession.mockResolvedValue(
        sessionWithIdentities({ "cognito:username": "LinkedIn_abc123" }),
      );

      await expect(isLinkedInSession()).resolves.toBe(true);
    });

    it("returns false for Google users", async () => {
      fetchAuthSession.mockResolvedValue(
        sessionWithIdentities({ identities: [{ providerName: "Google" }] }),
      );

      await expect(isLinkedInSession()).resolves.toBe(false);
    });

    it("returns false for email/password users", async () => {
      fetchAuthSession.mockResolvedValue(
        sessionWithIdentities({ "cognito:username": "priyanka" }),
      );

      await expect(isLinkedInSession()).resolves.toBe(false);
    });

    it("returns false when there is no session", async () => {
      fetchAuthSession.mockResolvedValue({});

      await expect(isLinkedInSession()).resolves.toBe(false);
    });

    it("returns false instead of throwing when the session lookup fails", async () => {
      fetchAuthSession.mockRejectedValue(new Error("no session"));

      await expect(isLinkedInSession()).resolves.toBe(false);
    });
  });

  describe("completePendingLinkedInLogout", () => {
    it("does nothing when no logout is pending", () => {
      expect(completePendingLinkedInLogout()).toBe(false);
      expect(assignMock).not.toHaveBeenCalled();
    });

    it("redirects to Auth0 first when a logout is pending", () => {
      markLinkedInLogoutPending();
      expect(isLinkedInLogoutPending()).toBe(true);

      expect(completePendingLinkedInLogout()).toBe(true);

      const target = assignMock.mock.calls[0][0];
      expect(target).toContain(AUTH0_DOMAIN);
      expect(target).toContain(`client_id=${AUTH0_CLIENT_ID}`);
      expect(target).toContain(
        `returnTo=${encodeURIComponent("http://localhost/login")}`,
      );
    });

    it("does not go straight to LinkedIn, since Auth0 must be cleared first", () => {
      markLinkedInLogoutPending();

      completePendingLinkedInLogout();

      expect(assignMock).not.toHaveBeenCalledWith(LINKEDIN_LOGOUT_URL);
    });

    it("advances to the LinkedIn stage after the Auth0 hop", () => {
      markLinkedInLogoutPending();
      completePendingLinkedInLogout();

      expect(window.sessionStorage.getItem(PENDING_LINKEDIN_LOGOUT_KEY)).toBe(
        LOGOUT_STAGE_LINKEDIN,
      );
    });

    it("only starts one navigation when the effect runs twice (StrictMode)", () => {
      markLinkedInLogoutPending();

      // React StrictMode invokes the effect twice within the same page load.
      completePendingLinkedInLogout();
      completePendingLinkedInLogout();

      expect(assignMock).toHaveBeenCalledTimes(1);
      expect(assignMock.mock.calls[0][0]).toContain(AUTH0_DOMAIN);
    });

    it("redirects to LinkedIn on the second pass and then stops", () => {
      markLinkedInLogoutPending();

      completePendingLinkedInLogout(); // Auth0
      resetLogoutRedirectGuard(); // simulates the real page load after Auth0
      expect(completePendingLinkedInLogout()).toBe(true); // LinkedIn

      expect(assignMock).toHaveBeenLastCalledWith(LINKEDIN_LOGOUT_URL);
      resetLogoutRedirectGuard();
      expect(completePendingLinkedInLogout()).toBe(false);
      expect(assignMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("buildAuth0LogoutUrl", () => {
    it("points returnTo at the dedicated logout route on the current origin", () => {
      const url = buildAuth0LogoutUrl("https://idptest-saayam.netlify.app");

      expect(url).toContain(
        `returnTo=${encodeURIComponent(
          "https://idptest-saayam.netlify.app/login",
        )}`,
      );
    });
  });
});
