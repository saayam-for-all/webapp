import authReducer, {
  loginRequest,
  loginSuccess,
  loginFailure,
} from "./authSlice";

describe("authSlice", () => {
  describe("initialState", () => {
    it("starts with loading: true so protected routes wait for auth check", () => {
      const state = authReducer(undefined, { type: "@@INIT" });
      expect(state.loading).toBe(true);
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
  });
});
