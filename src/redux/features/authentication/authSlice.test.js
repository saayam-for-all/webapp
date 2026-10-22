import authReducer, {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutSuccess,
} from "./authSlice";

describe("authSlice", () => {
  describe("initialState", () => {
    it("starts with authInitialized: false so protected routes wait for auth check", () => {
      const state = authReducer(undefined, { type: "@@INIT" });
      expect(state.authInitialized).toBe(false);
    });

    it("starts with loading: false", () => {
      const state = authReducer(undefined, { type: "@@INIT" });
      expect(state.loading).toBe(false);
    });

    it("starts with user: null", () => {
      const state = authReducer(undefined, { type: "@@INIT" });
      expect(state.user).toBeNull();
    });
  });

  describe("loginRequest", () => {
    it("sets loading: true", () => {
      const state = authReducer({ loading: false, user: null }, loginRequest());
      expect(state.loading).toBe(true);
    });
  });

  describe("loginSuccess", () => {
    it("sets loading: false and stores the user", () => {
      const mockUser = { userId: "u1", email: "test@example.com" };
      const state = authReducer(
        { loading: true, user: null },
        loginSuccess({ user: mockUser }),
      );
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    it("marks auth as initialized so ProtectedRoute stops waiting", () => {
      const state = authReducer(
        { loading: true, authInitialized: false, user: null },
        loginSuccess({ user: { userId: "u1" } }),
      );
      expect(state.authInitialized).toBe(true);
    });
  });

  describe("loginFailure", () => {
    it("sets loading: false so ProtectedRoute stops showing the loader", () => {
      const state = authReducer(
        { loading: true, user: null },
        loginFailure("Auth error"),
      );
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
    });

    it("marks auth as initialized so unauthenticated users get redirected", () => {
      const state = authReducer(
        { loading: true, authInitialized: false, user: null },
        loginFailure("Auth error"),
      );
      expect(state.authInitialized).toBe(true);
    });
  });

  describe("logoutSuccess", () => {
    it("clears the user and keeps auth initialized", () => {
      const state = authReducer(
        { loading: false, authInitialized: true, user: { userId: "u1" } },
        logoutSuccess(),
      );
      expect(state.user).toBeNull();
      expect(state.authInitialized).toBe(true);
    });
  });
});
