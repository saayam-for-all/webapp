import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromoteToVolunteer from "./PromoteToVolunteer";
import {
  MOCK_STATE_LOGGED_IN,
  renderWithProviders,
} from "#utils/test-utils.jsx";

jest.mock("aws-amplify/auth", () => ({
  getCurrentUser: jest.fn(() =>
    Promise.resolve({ username: "mockUser", userId: "123" }),
  ),
}));

const mockGetVolunteerSkills = jest.fn(() =>
  Promise.resolve({ body: { categories: {} } }),
);
const mockCreateVolunteer = jest.fn(() =>
  Promise.resolve({ data: { statusCode: 200 } }),
);
const mockUpdateVolunteer = jest.fn(() =>
  Promise.resolve({ data: { statusCode: 200 } }),
);

jest.mock("../../services/volunteerServices", () => ({
  getVolunteerSkills: () => mockGetVolunteerSkills(),
  createVolunteer: () => mockCreateVolunteer(),
  updateVolunteer: () => mockUpdateVolunteer(),
}));

jest.mock("./StepperControl", () => (props) => (
  <button onClick={() => props.handleClick("next")}>Next</button>
));

describe("PromoteToVolunteer Component", () => {
  it("renders Terms & Conditions on step 1", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
  });

  it("shows error when Next clicked with invalid data", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });
    fireEvent.click(screen.getByText("Next"));
    expect(
      screen.getByText(
        "Please complete all required fields before proceeding.",
      ),
    ).toBeInTheDocument();
  });

  it("calls getVolunteerSkills on mount", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    await waitFor(() => expect(mockGetVolunteerSkills).toHaveBeenCalled());
  });

  it("handles API error in fetchSkills gracefully", async () => {
    mockGetVolunteerSkills.mockImplementationOnce(() =>
      Promise.reject(new Error("API failed")),
    );
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    await waitFor(() => {
      expect(mockGetVolunteerSkills).toHaveBeenCalled();
    });
  });

  it("renders Volunteer Course on step 2", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("Identification")).toBeInTheDocument();
  });

  it("renders Skills on step 3", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });

  it("renders Availability on step 4", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText("Availability")).toBeInTheDocument();
  });
});
