import { screen } from "@testing-library/react";
import YourProfile from "./YourProfile";
import { MOCK_STATE_LOGGED_IN, renderWithProviders } from "#utils/test-utils";

// TODO: mock CallModal after adding tests for CallModal

describe("YourProfile", () => {
  it("renders correctly", () => {
    renderWithProviders(<YourProfile />);
    expect(screen.getByText("mockTranslate(PHONE_NUMBER)")).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(EMAIL)")).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(FIRST_NAME)")).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(LAST_NAME)")).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(COUNTRY")).toBeInTheDocument();
  });
});
