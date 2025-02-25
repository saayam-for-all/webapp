import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromoteToVolunteer from "../../src/pages/Volunteer/PromoteToVolunteer";
import Stepper from "../../src/pages/Volunteer/Stepper";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../src/redux/features/authentication/authSlice";

const renderWithRedux = (component) => {
  const store = configureStore({
    reducer: {
      auth: authReducer, // Mock auth reducer
    },
    preloadedState: {
      auth: { idToken: "mockToken" }, // Mock initial state
    },
  });

  return render(<Provider store={store}>{component}</Provider>);
};

jest.mock("../../src/services/volunteerServices", () => ({
  getVolunteerSkills: jest.fn(() =>
    Promise.resolve({ message: "Mocked API Response" }),
  ),
}));

describe("PromoteToVolunteer Component", () => {
  test("renders Terms & Conditions on step 1", () => {
    renderWithRedux(<PromoteToVolunteer />);

    expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
  });

  test("renders Volunteer Course on step 2", () => {
    renderWithRedux(<PromoteToVolunteer />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("Identification")).toBeInTheDocument();
  });

  test("renders Skills on step 3", () => {
    renderWithRedux(<PromoteToVolunteer />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });

  test("renders Availability on step 4", () => {
    renderWithRedux(<PromoteToVolunteer />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText("Availability")).toBeInTheDocument();
  });

  /*
    test('renders Complete on step 5', () => {
      render(<PromoteToVolunteer />);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
*/
});
