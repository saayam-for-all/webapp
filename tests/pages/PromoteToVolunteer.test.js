import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromoteToVolunteer from "../../src/pages/Volunteer/PromoteToVolunteer";
import Stepper from "../../src/pages/Volunteer/Stepper";


//LAYOUT
test('checks div classes',() =>{
  jest.mock('axios')
  render(<PromoteToVolunteer />);
  const firstDiv = screen.getByTestId('divOne')
  const secondDiv = screen.getByTestId('divTwo')
  const thirdDiv = screen.getByTestId('divThree')

  expect(firstDiv).toBeInTheDocument()
  expect(secondDiv).toBeInTheDocument()
  expect(thirdDiv).toBeInTheDocument()

})

//LOGIC

describe("PromoteToVolunteer Component", () => {
  test("renders Terms & Conditions on step 1", () => {

    jest.mock('axios')

    render(<PromoteToVolunteer />);

    expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
  });

  test("renders Volunteer Course on step 2", () => {
    render(<PromoteToVolunteer />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("Identification")).toBeInTheDocument();
  });

  test("renders Skills on step 3", () => {
    render(<PromoteToVolunteer />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });

  test("renders Availability on step 4", () => {
    render(<PromoteToVolunteer />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText("Availability")).toBeInTheDocument();
  });

  
    test('renders Complete on step 5', () => {
      render(<PromoteToVolunteer />);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
});
