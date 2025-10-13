import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Stepper from "./Stepper";
import {
  renderWithProviders,
  MOCK_STATE_LOGGED_IN,
} from "#utils/test-utils.jsx";

describe("Stepper Component", () => {
  const steps = [
    "Terms & Conditions",
    "Identification",
    "Skills",
    "Availability",
    "Complete",
  ];

  it("renders all step descriptions", () => {
    renderWithProviders(<Stepper steps={steps} currentStep={1} />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it("initially highlights and selects only the first step", () => {
    renderWithProviders(<Stepper steps={steps} currentStep={1} />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const firstStepCircle = screen.getByText("1").closest("div");
    expect(firstStepCircle).toHaveClass("bg-green-600"); // selected
    expect(screen.getByText("Terms & Conditions")).toHaveClass("text-gray-900"); // highlighted

    // Verify other steps are not highlighted/selected
    expect(screen.getByText("Identification")).toHaveClass("text-gray-600");
    expect(screen.getByText("Skills")).toHaveClass("text-gray-600");
  });

  it("marks previous step as completed when currentStep advances", () => {
    const { rerender } = renderWithProviders(
      <Stepper steps={steps} currentStep={2} />,
      { preloadedState: MOCK_STATE_LOGGED_IN },
    );

    // First step should now be completed (checkmark)
    expect(screen.getByText("✓")).toBeInTheDocument();

    // Second step should be selected
    const secondStepCircle = screen.getByText("2").closest("div");
    expect(secondStepCircle).toHaveClass("bg-green-600");
  });

  it("updates correctly when currentStep changes dynamically", () => {
    const { rerender } = renderWithProviders(
      <Stepper steps={steps} currentStep={1} />,
      { preloadedState: MOCK_STATE_LOGGED_IN },
    );

    // Initially first highlighted
    expect(screen.getByText("Terms & Conditions")).toHaveClass("text-gray-900");

    // Move to step 3
    rerender(<Stepper steps={steps} currentStep={3} />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Step 1 and 2 should be completed, Step 3 highlighted
    expect(screen.getAllByText("✓")).toHaveLength(1);
    expect(screen.getByText("Skills")).toHaveClass("text-gray-900");
  });

  it("renders connector lines between steps with correct color", () => {
    renderWithProviders(<Stepper steps={steps} currentStep={3} />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const connectors = document.querySelectorAll(".border-t-2");
    expect(connectors.length).toBeGreaterThan(0);

    expect(connectors[1].className).toContain("border-green-600");
  });
});
