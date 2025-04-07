import { render } from "@testing-library/react";
import YourProfile from "./YourProfile";
import { MOCK_STATE_LOGGED_IN, renderWithProviders } from "#utils/test-utils";

// TODO: mock CallModal after adding tests for CallModal

describe("YourProfile", () => {
  it("renders correctly", () => {
    renderWithProviders(<YourProfile />);
    expect(getByText("Phone Number")).toBeInTheDocument();
    expect(getByText("Email")).toBeInTheDocument();
    expect(getByText("First Name")).toBeInTheDocument();
    expect(getByText("Last Name")).toBeInTheDocument();
    expect(getByText("Country")).toBeInTheDocument();
  });
});
