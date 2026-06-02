import {
  AUTH_PROVIDER_STORAGE_KEY,
  clearPersistedAuthProvider,
  getLinkedInLogoutUrl,
  getPersistedAuthProvider,
  isLinkedInAuthProvider,
  parseAuthProviderFromAttributes,
  persistAuthProvider,
} from "./linkedInAuth";

const sessionStorageMock = {
  store: {},
  getItem: jest.fn((key) => sessionStorageMock.store[key] ?? null),
  setItem: jest.fn((key, value) => {
    sessionStorageMock.store[key] = value;
  }),
  removeItem: jest.fn((key) => {
    delete sessionStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    sessionStorageMock.store = {};
  }),
};

Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

describe("linkedInAuth", () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    jest.clearAllMocks();
  });

  describe("parseAuthProviderFromAttributes", () => {
    it("returns provider name from identities JSON", () => {
      expect(
        parseAuthProviderFromAttributes({
          identities:
            '[{"providerName":"LinkedIn","userId":"abc","providerType":"OIDC"}]',
        }),
      ).toBe("LinkedIn");
    });

    it("returns null when identities is missing", () => {
      expect(parseAuthProviderFromAttributes({})).toBeNull();
    });
  });

  describe("isLinkedInAuthProvider", () => {
    it("matches LinkedIn case-insensitively", () => {
      expect(isLinkedInAuthProvider("LinkedIn")).toBe(true);
      expect(isLinkedInAuthProvider("linkedin")).toBe(true);
      expect(isLinkedInAuthProvider("Google")).toBe(false);
    });
  });

  describe("persistAuthProvider", () => {
    it("stores and reads provider from sessionStorage", () => {
      persistAuthProvider("LinkedIn");
      expect(getPersistedAuthProvider()).toBe("LinkedIn");
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        AUTH_PROVIDER_STORAGE_KEY,
        "LinkedIn",
      );
    });

    it("clears storage when provider is null", () => {
      persistAuthProvider("LinkedIn");
      persistAuthProvider(null);
      expect(getPersistedAuthProvider()).toBeNull();
    });

    it("clearPersistedAuthProvider removes stored provider", () => {
      persistAuthProvider("LinkedIn");
      clearPersistedAuthProvider();
      expect(getPersistedAuthProvider()).toBeNull();
    });
  });

  describe("getLinkedInLogoutUrl", () => {
    it("uses OIDC logout URL when client id is configured", () => {
      import.meta.env.VITE_LINKEDIN_CLIENT_ID = "test-client-id";
      const url = getLinkedInLogoutUrl("https://example.com/login");
      expect(url).toContain("https://www.linkedin.com/oauth/v2/logout");
      expect(url).toContain("client_id=test-client-id");
      expect(url).toContain(
        "redirect_uri=" + encodeURIComponent("https://example.com/login"),
      );
      delete import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    });

    it("falls back to member logout URL without client id", () => {
      delete import.meta.env.VITE_LINKEDIN_CLIENT_ID;
      expect(getLinkedInLogoutUrl()).toBe("https://www.linkedin.com/m/logout/");
    });
  });
});
