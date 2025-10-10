// Setup file for Jest tests
import "@testing-library/jest-dom";

// Mock Amplify Auth to prevent AuthUserPoolException during tests
jest.mock("aws-amplify/auth", () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    userId: "mock-user-id",
    username: "mock-user",
  }),
  fetchUserAttributes: jest.fn().mockResolvedValue({
    email: "test@example.com",
    given_name: "Test",
    family_name: "User",
    phone_number: "+1234567890",
    "custom:Country": "United States",
  }),
  fetchAuthSession: jest.fn().mockResolvedValue({
    tokens: {
      accessToken: {
        payload: {
          "cognito:groups": ["user"],
        },
      },
    },
  }),
  signIn: jest.fn().mockResolvedValue({
    isSignedIn: true,
  }),
  signUp: jest.fn().mockResolvedValue({
    isSignUpComplete: true,
  }),
  confirmSignUp: jest.fn().mockResolvedValue(true),
  signOut: jest.fn().mockResolvedValue(true),
}));

// Mock Amplify configure to prevent configuration errors
jest.mock("aws-amplify", () => ({
  Amplify: {
    configure: jest.fn(),
  },
}));

// Suppress React act warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Warning: An update to %s inside a test was not wrapped in act",
      )
    ) {
      return;
    }
    return originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
