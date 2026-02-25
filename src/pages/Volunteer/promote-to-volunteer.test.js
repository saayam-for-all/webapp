import { screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromoteToVolunteer from "./PromoteToVolunteer";
import {
  MOCK_STATE_LOGGED_IN,
  renderWithProviders,
} from "#utils/test-utils.jsx";

// Mock AWS Amplify
jest.mock("aws-amplify/auth", () => ({
  getCurrentUser: jest.fn(() => Promise.resolve({ userId: "mock-user-id" })),
}));

jest.mock("../../services/volunteerServices", () => ({
  getVolunteerSkills: jest.fn(() =>
    Promise.resolve({
      body: {
        categories: {
          "Test Category": {
            checked: false,
            "Sub Category": { checked: false },
          },
        },
      },
    }),
  ),
}));

describe("PromoteToVolunteer Component", () => {
  const mockStateWithGroups = {
    ...MOCK_STATE_LOGGED_IN,
    auth: {
      ...MOCK_STATE_LOGGED_IN.auth,
      user: {
        ...MOCK_STATE_LOGGED_IN.auth.user,
        groups: ["Beneficiaries"],
      },
    },
  };

  it("renders Terms & Conditions on step 1", async () => {
    await act(async () => {
      renderWithProviders(<PromoteToVolunteer />, {
        preloadedState: mockStateWithGroups,
      });
    });

    expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
  });

  it("renders Volunteer Course on step 2", async () => {
    await act(async () => {
      renderWithProviders(<PromoteToVolunteer />, {
        preloadedState: mockStateWithGroups,
      });
    });

    const nextButton = screen.getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    expect(screen.getByText("Identification")).toBeInTheDocument();
  });

  it("renders Skills on step 3", async () => {
    await act(async () => {
      renderWithProviders(<PromoteToVolunteer />, {
        preloadedState: mockStateWithGroups,
      });
    });

    const nextButton = screen.getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
    });

    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });

  it("renders Availability on step 4", async () => {
    await act(async () => {
      renderWithProviders(<PromoteToVolunteer />, {
        preloadedState: mockStateWithGroups,
      });
    });

    const nextButton = screen.getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
    });

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
