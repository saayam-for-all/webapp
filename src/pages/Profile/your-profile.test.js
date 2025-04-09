import React from "react";
import { render } from "@testing-library/react";
import YourProfile from "./YourProfile";

// mock i18n
jest.mock("#common/i18n/i18n", () => ({}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// mock AWS Amplify auth functions
jest.mock("aws-amplify/auth", () => ({
  fetchUserAttributes: jest.fn(() => Promise.resolve([])),
  updateUserAttributes: jest.fn(() => Promise.resolve()),
}));

describe("YourProfile", () => {
  it("renders the component without crashing", () => {
    render(<YourProfile />);
  });
});
