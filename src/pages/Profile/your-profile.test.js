import { render } from "@testing-library/react";
import YourProfile from "./YourProfile";
import { MOCK_STATE_LOGGED_IN, renderWithProviders } from "#utils/test-utils";

// TODO: mock CallModal after adding tests for CallModal

describe("YourProfile", () => {
  it("renders correctly", () => {
    const { getByText } = renderWithProviders(<YourProfile />);
    expect(getByText("Notifications")).toBeInTheDocument();
  });
});
