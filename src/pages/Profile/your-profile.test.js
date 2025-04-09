import React from "react";
import { render } from "@testing-library/react";
import YourProfile from "./YourProfile";

// Minimal mocks to prevent errors
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

describe("YourProfile - Basic Render Test", () => {
  it("renders without crashing", () => {
    render(<YourProfile setHasUnsavedChanges={jest.fn()} />);
  });
});
