import { screen } from "@testing-library/react";
import YourProfile from "./YourProfile";
import { MOCK_STATE_LOGGED_IN, renderWithProviders } from "#utils/test-utils";

// TODO: mock CallModal after adding tests for CallModal

describe("YourProfile", () => {
  it("renders correctly", () => {
    renderWithProviders(<YourProfile />);
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Country")).toBeInTheDocument();
  });
});
