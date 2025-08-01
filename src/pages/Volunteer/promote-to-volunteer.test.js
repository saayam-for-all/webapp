import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromoteToVolunteer from "./PromoteToVolunteer";
import {
  MOCK_STATE_LOGGED_IN,
  renderWithProviders,
} from "#utils/test-utils.jsx";

jest.mock("../../services/volunteerServices", () => ({
  getVolunteerSkills: jest.fn(() =>
    Promise.resolve({ message: "Mocked API Response" }),
  ),
}));

describe("PromoteToVolunteer Component", () => {
  it("renders Terms & Conditions on step 1", () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
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

  /*
    it('renders Complete on step 5', () => {
      renderWithProviders(<PromoteToVolunteer />, {preloadedState: MOCK_STATE_LOGGED_IN});

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
*/
});
