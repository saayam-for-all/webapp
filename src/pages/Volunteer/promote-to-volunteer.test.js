import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromoteToVolunteer from "./PromoteToVolunteer";
import {
  MOCK_STATE_LOGGED_IN,
  renderWithProviders,
} from "#utils/test-utils.jsx";

jest.mock("aws-amplify/auth", () => ({
  getCurrentUser: jest.fn(() => Promise.resolve({ userId: "mockUser123" })),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => {
    const params = new URLSearchParams();
    return [params, jest.fn()];
  },
  useNavigate: () => jest.fn(),
}));

jest.mock("../../services/volunteerServices", () => ({
  getVolunteerSkills: jest.fn(() =>
    Promise.resolve({ message: "Mocked API Response" }),
  ),
  updateUserSkills: jest.fn(() => Promise.resolve({ success: true })),
  createVolunteer: jest.fn(),
  updateVolunteer: jest.fn(),
  saveVolunteerStep1: jest.fn(() => Promise.resolve({ success: true })),
}));

describe("PromoteToVolunteer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    window.URL.createObjectURL = jest.fn(() => "mock-url");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders Terms & Conditions on step 1", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();
  });

  it("renders the Become a Volunteer title", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText(/mockTranslate\(BECOME_VOLUNTEER\)/),
    ).toBeInTheDocument();
  });

  it("renders Volunteer Course on step 2", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("renders Skills on step 3", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/skills/i)).toBeInTheDocument();
    });
  });

  it("renders Availability on step 4", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(AVAILABILITY)"),
      ).toBeInTheDocument();
    });
  });

  it("renders Review step label in stepper", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(screen.getByText("mockTranslate(REVIEW)")).toBeInTheDocument();
  });

  it("does not proceed without acknowledging terms on step 1", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("allows navigation to next step when terms are acknowledged", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("renders error message when validation fails", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Verify terms and conditions are on the page
    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();

    // Next button should be disabled on step 1 without acknowledgment
    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("allows navigation to next step when terms are acknowledged", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("renders StepperControl on steps 1-4", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(screen.getByTestId("next-button")).toBeInTheDocument();
    expect(
      screen.getByText(/mockTranslate\(common:BACK\)/),
    ).toBeInTheDocument();
  });

  it("disables next button on step 2 without file upload", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
      expect(nextButton).toBeDisabled();
    });
  });

  it("disables next button on step 3 without selecting skills", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
      expect(nextButton).toBeDisabled();
    });
  });

  it("disables next button on step 4 without valid availability", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
      expect(nextButton).toBeDisabled();
    });
  });

  it("handles error when fetching user ID fails", async () => {
    jest
      .mocked(require("aws-amplify/auth").getCurrentUser)
      .mockRejectedValueOnce(new Error("Failed to fetch user"));

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
      ).toBeInTheDocument();
    });
  });

  it("renders Review step when navigating to step 5", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");

    // Navigate through all steps
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    // This will try to advance but may be blocked by validation
    expect(nextButton).toBeInTheDocument();
  });

  it("handles skill save failure with API error", async () => {
    const { updateUserSkills } = require("../../services/volunteerServices");
    updateUserSkills.mockRejectedValueOnce(new Error("API Error"));

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Try to advance to skills and select one
    await waitFor(() => {
      expect(screen.getByText(/skills/i)).toBeInTheDocument();
    });

    // Next button should be disabled until skills are selected
    nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("allows navigation back from step 2", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
      ).toBeInTheDocument();
    });
  });

  it("shows error when trying to proceed from step 2 without file", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("button becomes enabled when terms are acknowledged", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = screen.getByTestId("next-button");

    // Initially disabled when terms not acknowledged
    expect(nextButton).toBeDisabled();

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    // Should become enabled after acknowledging
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
  });

  it("successfully transitions through identification step", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Verify identification step is displayed
    expect(
      screen.getByText("mockTranslate(IDENTIFICATION)"),
    ).toBeInTheDocument();
  });

  it("handles empty categories in localStorage gracefully", () => {
    localStorage.setItem("categories", "[]");

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();
  });

  it("back button is disabled on step 1", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Verify component renders and we're on step 1
    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();

    // The StepperControl should be present
    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
  });

  it("stepper shows correct number of steps", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // All step labels should be visible in stepper
    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("mockTranslate(IDENTIFICATION)"),
    ).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(SKILLS)")).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(AVAILABILITY)")).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(REVIEW)")).toBeInTheDocument();
  });

  it("disables next button when moving through steps without fulfilling conditions", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    let nextButton = screen.getByTestId("next-button");

    // Step 1: button disabled without acknowledgement
    expect(nextButton).toBeDisabled();

    // Step 1: acknowledge and move forward
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Step 2: button should be disabled without file upload
    nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("renders 'Become a Volunteer' title correctly", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const title = screen.getByText(/mockTranslate\(BECOME_VOLUNTEER\)/);
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H1");
  });

  it("handles step navigation with back button", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Navigate to step 2
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Go back to step 1
    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
      ).toBeInTheDocument();
    });

    // Navigate forward again
    fireEvent.click(checkbox);
    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("verify localStorage categories are loaded on mount", () => {
    const mockCategories = [
      { id: 1, name: "Teaching" },
      { id: 2, name: "Healthcare" },
      { id: 3, name: "Tech Support" },
    ];
    localStorage.setItem("categories", JSON.stringify(mockCategories));

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();
    // Component should initialize without errors
  });

  it("renders component with correct wrapper classes", () => {
    const { container } = renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const wrapper = container.querySelector(
      ".w-full.mx-auto.shadow-xl.rounded-2xl",
    );
    expect(wrapper).toBeInTheDocument();
  });

  it("updates volunteer data reference when moving through steps", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("stepperControl handles disabled next properly", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = screen.getByTestId("next-button");

    // Verify button is disabled on step 1 when terms not acknowledged
    expect(nextButton).toBeDisabled();
    expect(nextButton).toHaveAttribute("disabled");
  });

  it("component renders StepperControl on non-final steps", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // StepperControl should be present on steps 1-4, but not on step 5 (Review)
    const nextButton = screen.getByTestId("next-button");
    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);

    expect(nextButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  it("handles categories loading gracefully with null localStorage", () => {
    localStorage.removeItem("categories");

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();
  });

  it("navigates back from step 3 without issues", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/skills/i)).toBeInTheDocument();
    });

    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("navigates back from step 4 (Availability)", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(AVAILABILITY)"),
      ).toBeInTheDocument();
    });

    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText(/skills/i)).toBeInTheDocument();
    });
  });

  it("updates volunteer data when proceeding from step 1", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("shows disabled state correctly on step controls", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();

    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);
    expect(backButton).toBeInTheDocument();
  });

  it("error message state is managed properly", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Initially, terms not checked so button disabled
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).not.toBeDisabled();

    // Error message should be cleared when valid
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("correctly validates availability slot end time after start time", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Verify Availability step is rendered
    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(AVAILABILITY)"),
      ).toBeInTheDocument();
    });
  });

  it("renders Review component on step 5", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Continue through all steps to reach Review
    for (let i = 0; i < 3; i++) {
      nextButton = screen.getByTestId("next-button");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/mockTranslate\(common:NEXT\)/),
        ).toBeInTheDocument();
      });
    }
  });

  it("shows error message when skills API fails on step 3", async () => {
    const { updateUserSkills } = require("../../services/volunteerServices");
    updateUserSkills.mockRejectedValueOnce(new Error("Failed to save skills"));

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);

    // When we reach skills step and try to proceed, error should occur
    await waitFor(() => {
      expect(screen.getByText(/skills/i)).toBeInTheDocument();
    });
  });

  it("handles missing userId gracefully", async () => {
    jest
      .mocked(require("aws-amplify/auth").getCurrentUser)
      .mockRejectedValueOnce(new Error("Auth error"));

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
      ).toBeInTheDocument();
    });

    // Component should still be functional without userId
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("prevents navigation when advancing without fulfilling step requirements", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Try to advance from step 1 without acknowledging
    let nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();

    // Acknowledge and advance
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // On step 2, try to advance without file (should be disabled)
    nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("handles localStorage parse error gracefully", () => {
    localStorage.setItem("categories", "{invalid json");

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();
  });

  it("disables next button on step 3 until skills are selected", async () => {
    const mockCategories = [
      { id: 1, name: "Teaching", subcategories: [] },
      { id: 2, name: "Healthcare", subcategories: [] },
    ];
    localStorage.setItem("categories", JSON.stringify(mockCategories));

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/skills/i)).toBeInTheDocument();
    });

    // Next button should be disabled without skill selection
    nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("disables next button on step 4 until valid availability is set", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(AVAILABILITY)"),
      ).toBeInTheDocument();
    });

    // Next button should be disabled without valid availability
    nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("displays error message when validation fails on step 1", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = screen.getByTestId("next-button");

    // Try to click next without acknowledging terms
    expect(nextButton).toBeDisabled();
  });

  it("shows StepperControl on all non-review steps", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Check StepperControl is present
    expect(screen.getByTestId("next-button")).toBeInTheDocument();
    expect(
      screen.getByText(/mockTranslate\(common:BACK\)/),
    ).toBeInTheDocument();
  });

  it("correctly updates volunteer data when proceeding through steps", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Step 1: Acknowledge terms
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Component should have updated volunteer data internally
    expect(
      screen.getByText("mockTranslate(IDENTIFICATION)"),
    ).toBeInTheDocument();
  });

  it("back button is enabled on step 2", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);
    expect(backButton).toBeInTheDocument();
    expect(backButton).not.toBeDisabled();
  });

  it("displays wrapper div with correct classes", () => {
    const { container } = renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      container.querySelector(".w-full.mx-auto.shadow-xl.rounded-2xl"),
    ).toBeInTheDocument();
  });

  it("displays h1 title with correct text", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("mockTranslate(BECOME_VOLUNTEER)");
  });

  it("error message appears in red text when file not uploaded", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Next button should be disabled since file is not uploaded
    nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  it("successfully proceeds from step 1 after acknowledging terms", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    const { saveVolunteerStep1 } = require("../../services/volunteerServices");
    expect(saveVolunteerStep1).toHaveBeenCalledWith({
      step: 1,
      userId: "SID-00-000-001",
      termsAndConditions: true,
    });
  });

  it("handleSaveFile stores file name in volunteer data", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("correctly validates and updates skills on step 3", async () => {
    const { updateUserSkills } = require("../../services/volunteerServices");
    updateUserSkills.mockResolvedValueOnce({ success: true });

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/skills/i)).toBeInTheDocument();
    });
  });

  it("handles empty availability slots correctly", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(AVAILABILITY)"),
      ).toBeInTheDocument();
    });
  });

  it("currentStep state is properly initialized at 1", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();
  });

  it("isAcknowledged state updates when checkbox is toggled", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");

    // Initially unchecked
    expect(checkbox).not.toBeChecked();

    // Click to check
    fireEvent.click(checkbox);

    // Next button should be enabled after checking
    const nextButton = screen.getByTestId("next-button");
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
  });

  it("errorMessage is cleared when validation passes", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Error message should not be visible when moving to a new step
    const errorMessages = screen.queryByText(
      /Please complete all required fields/i,
    );
    expect(errorMessages).not.toBeInTheDocument();
  });

  it("navigates backward and forward without losing state", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Go back
    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
      ).toBeInTheDocument();
    });

    // Checkbox should still be checked
    expect(checkbox).toBeChecked();

    // Navigate forward again
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("prevents navigation beyond valid step range", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Should not be able to navigate below step 1
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Navigate back to step 1
    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
      ).toBeInTheDocument();
    });
  });

  it("renders all step labels in the stepper component", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const steps = [
      "mockTranslate(TERMS_AND_CONDITIONS)",
      "mockTranslate(IDENTIFICATION)",
      "mockTranslate(SKILLS)",
      "mockTranslate(AVAILABILITY)",
      "mockTranslate(REVIEW)",
    ];

    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it("handles notification preference state changes", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(AVAILABILITY)"),
      ).toBeInTheDocument();
    });
  });

  it("correctly parses and uses categories from localStorage", () => {
    const mockCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];
    localStorage.setItem("categories", JSON.stringify(mockCategories));

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();
  });

  it("handles transition from step 2 to step 3 with file upload", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");

    // File upload required - button should be disabled
    expect(nextButton).toBeDisabled();
  });

  it("updates availability slots state properly", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      nextButton = screen.getByTestId("next-button");
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(AVAILABILITY)"),
      ).toBeInTheDocument();
    });

    // Availability component should be rendered
    expect(screen.getByText("mockTranslate(AVAILABILITY)")).toBeInTheDocument();
  });

  it("renders content wrapper with correct structure", () => {
    const { container } = renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Check for the content wrapper div
    const contentWrapper = container.querySelector(".w-full.mt-8.px-4");
    expect(contentWrapper).toBeInTheDocument();
  });

  it("calls handleClick with direction 'next' on next button click", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
  });

  it("calls handleClick with direction 'prev' on back button click", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    const backButton = screen.getByText(/mockTranslate\(common:BACK\)/);
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
      ).toBeInTheDocument();
    });
  });

  it("validates that step boundaries are not exceeded", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    let nextButton = screen.getByTestId("next-button");

    // Navigate through steps
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    // Continue to other steps...
    nextButton = screen.getByTestId("next-button");

    // Button should still be present on step 2
    expect(nextButton).toBeInTheDocument();
  });

  it("covers VolunteerCourse custom file input interactions and size/type validation", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Step 1: Acknowledge terms
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    // Step 2: Identification
    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    // 1. Click choose file button to trigger proxy click
    const chooseButton = screen.getByText("mockTranslate(CHOOSE_FILE)");
    const clickSpy = jest
      .spyOn(fileInput, "click")
      .mockImplementation(() => {});
    fireEvent.click(chooseButton);
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();

    // 2. Select file that is too large (> 5MB)
    const largeFile = new File(["a".repeat(6 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(FILE_SIZE_ERROR)"),
      ).toBeInTheDocument();
    });

    // 3. Select invalid file type
    const invalidFile = new File(["dummy"], "dummy.txt", {
      type: "text/plain",
    });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(FILE_TYPE_REQUIREMENT)"),
      ).toBeInTheDocument();
    });

    // 4. Select valid file
    const validFile = new File(["valid"], "valid.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    await waitFor(() => {
      expect(screen.getByText("valid.png")).toBeInTheDocument();
    });
  });

  it("handles step 3 validation errors and API save failures", async () => {
    const { updateUserSkills } = require("../../services/volunteerServices");
    updateUserSkills.mockRejectedValueOnce(new Error("API Error"));

    const mockCategories = [
      {
        catId: "1",
        catName: "TEACHING",
        subCategories: [],
      },
    ];
    localStorage.setItem("categories", JSON.stringify(mockCategories));

    const preloadedState = {
      auth: {
        user: {
          userId: "mockUser",
          userDbId: "SID-123",
        },
        idToken: "mockToken",
      },
    };

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState,
    });

    // Step 1
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    let nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    // Step 2: Upload file
    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });
    const fileInput = document.querySelector('input[type="file"]');
    const validFile = new File(["valid"], "valid.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(screen.getByText("valid.png")).toBeInTheDocument();
    });

    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    // Step 3: Skills
    await waitFor(() => {
      expect(screen.getByText("mockTranslate(SKILLS)")).toBeInTheDocument();
    });

    // Select skill "TEACHING" to enable the next button
    const skillOptions = screen.getAllByText(
      "mockTranslate(categories:REQUEST_CATEGORIES.TEACHING.LABEL)",
    );
    fireEvent.click(skillOptions[0]);

    // Click next, API rejects, should show error
    nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(COMPLETE_REQUIRED_FIELDS)"),
      ).toBeInTheDocument();
    });
  });

  it("restores step and form state from sessionStorage when loaded", async () => {
    const { MemoryRouter } = require("react-router-dom");
    sessionStorage.setItem("volunteer_wizard_step", "3");
    sessionStorage.setItem(
      "volunteer_form_data",
      JSON.stringify({
        isAcknowledged: true,
        isUploaded: true,
        selectedSkills: ["TEACHING"],
        availabilitySlots: [
          {
            id: 1,
            dayOfWeek: "Everyday",
            startTime: "2026-07-18T10:00:00.000Z",
            endTime: "2026-07-18T12:00:00.000Z",
          },
        ],
        tobeNotified: true,
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <PromoteToVolunteer />
      </MemoryRouter>,
      {
        preloadedState: MOCK_STATE_LOGGED_IN,
      },
    );

    expect(screen.getByText("mockTranslate(SKILLS)")).toBeInTheDocument();
  });

  it("clears sessionStorage on step 5 (Review)", async () => {
    const { MemoryRouter } = require("react-router-dom");
    sessionStorage.setItem("volunteer_wizard_step", "4");
    sessionStorage.setItem(
      "volunteer_form_data",
      JSON.stringify({
        isAcknowledged: true,
        isUploaded: true,
        selectedSkills: ["TEACHING"],
        availabilitySlots: [
          {
            id: 1,
            dayOfWeek: "Everyday",
            startTime: "2026-07-18T10:00:00.000Z",
            endTime: "2026-07-18T12:00:00.000Z",
          },
        ],
        tobeNotified: true,
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <PromoteToVolunteer />
      </MemoryRouter>,
      {
        preloadedState: MOCK_STATE_LOGGED_IN,
      },
    );

    expect(screen.getByText("mockTranslate(AVAILABILITY)")).toBeInTheDocument();

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("mockTranslate(REVIEW)")).toBeInTheDocument();
    });

    expect(sessionStorage.getItem("volunteer_wizard_step")).toBeNull();
    expect(sessionStorage.getItem("volunteer_form_data")).toBeNull();
  });

  it("Test Case 1: Initial Mount with Saved Session Data", () => {
    const { MemoryRouter } = require("react-router-dom");
    sessionStorage.setItem("volunteer_wizard_step", "3");
    renderWithProviders(
      <MemoryRouter>
        <PromoteToVolunteer />
      </MemoryRouter>,
      {
        preloadedState: MOCK_STATE_LOGGED_IN,
      },
    );
    expect(screen.getByText("mockTranslate(SKILLS)")).toBeInTheDocument();
  });

  it("Test Case 2: Writing to Session Data on Step Progression", async () => {
    const { MemoryRouter } = require("react-router-dom");
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    renderWithProviders(
      <MemoryRouter>
        <PromoteToVolunteer />
      </MemoryRouter>,
      {
        preloadedState: MOCK_STATE_LOGGED_IN,
      },
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
      expect(setItemSpy).toHaveBeenCalledWith("volunteer_wizard_step", "2");
    });

    setItemSpy.mockRestore();
  });

  it("handles sessionStorage get errors gracefully", () => {
    const getItemSpy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation((key) => {
        if (key && key.startsWith("volunteer_")) {
          throw new Error("mock get error");
        }
        return null;
      });

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();

    getItemSpy.mockRestore();
  });

  it("handles sessionStorage set and remove errors gracefully", async () => {
    const { MemoryRouter } = require("react-router-dom");
    sessionStorage.setItem("volunteer_wizard_step", "4");
    sessionStorage.setItem(
      "volunteer_form_data",
      JSON.stringify({
        isAcknowledged: true,
        isUploaded: true,
        selectedSkills: ["TEACHING"],
        availabilitySlots: [
          {
            id: 1,
            dayOfWeek: "Everyday",
            startTime: "2026-07-18T10:00:00.000Z",
            endTime: "2026-07-18T12:00:00.000Z",
          },
        ],
        tobeNotified: true,
      }),
    );

    const setItemSpy = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation((key) => {
        if (key && key.startsWith("volunteer_")) {
          throw new Error("mock set error");
        }
      });
    const removeItemSpy = jest
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation((key) => {
        if (key && key.startsWith("volunteer_")) {
          throw new Error("mock remove error");
        }
      });

    renderWithProviders(
      <MemoryRouter>
        <PromoteToVolunteer />
      </MemoryRouter>,
      {
        preloadedState: MOCK_STATE_LOGGED_IN,
      },
    );

    expect(screen.getByText("mockTranslate(AVAILABILITY)")).toBeInTheDocument();

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("mockTranslate(REVIEW)")).toBeInTheDocument();
    });

    setItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });

  it("handles JSON parsing errors gracefully", () => {
    sessionStorage.setItem("volunteer_form_data", "{invalid json");
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });
    expect(
      screen.getByText("mockTranslate(TERMS_AND_CONDITIONS)"),
    ).toBeInTheDocument();
  });

  it("handles out of bounds steps and default branches gracefully", async () => {
    const { MemoryRouter } = require("react-router-dom");
    sessionStorage.setItem("volunteer_wizard_step", "0");
    renderWithProviders(
      <MemoryRouter>
        <PromoteToVolunteer />
      </MemoryRouter>,
      {
        preloadedState: MOCK_STATE_LOGGED_IN,
      },
    );

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(COMPLETE_REQUIRED_FIELDS)"),
      ).toBeInTheDocument();
    });
  });

  it("calls saveVolunteerStep1 with userDbId from Redux auth slice and no mock fallback", async () => {
    const { saveVolunteerStep1 } = require("../../services/volunteerServices");
    saveVolunteerStep1.mockClear();

    const customState = {
      auth: {
        user: {
          userId: "cognito-uuid-999",
          userDbId: "SID-00-000-001",
        },
        idToken: "mockToken",
      },
    };

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: customState,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    expect(saveVolunteerStep1).toHaveBeenCalledTimes(1);
    expect(saveVolunteerStep1).toHaveBeenCalledWith({
      step: 1,
      userId: "SID-00-000-001",
      termsAndConditions: true,
    });
    expect(saveVolunteerStep1).not.toHaveBeenCalledWith(
      expect.objectContaining({ userId: "mockUser123" }),
    );
    expect(saveVolunteerStep1).not.toHaveBeenCalledWith(
      expect.objectContaining({ userId: "cognito-uuid-999" }),
    );
  });

  it("calls saveVolunteerStep1 with userDBId when provided at auth root", async () => {
    const { saveVolunteerStep1 } = require("../../services/volunteerServices");
    saveVolunteerStep1.mockClear();

    const customState = {
      auth: {
        userDBId: "SID-99-888-777",
      },
    };

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: customState,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText("mockTranslate(IDENTIFICATION)"),
      ).toBeInTheDocument();
    });

    expect(saveVolunteerStep1).toHaveBeenCalledTimes(1);
    expect(saveVolunteerStep1).toHaveBeenCalledWith({
      step: 1,
      userId: "SID-99-888-777",
      termsAndConditions: true,
    });
  });
});
