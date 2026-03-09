import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import StepperControl from "./StepperControl";

jest.mock("react-i18next");

const defaultProps = {
  handleClick: jest.fn(),
  currentStep: 1,
  steps: ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  isAcknowledged: true,
  isUploaded: true,
  isAvailabilityValid: true,
};

describe("StepperControl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { container } = render(<StepperControl {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it("renders Back and Next buttons", () => {
    render(<StepperControl {...defaultProps} />);
    expect(screen.getByText(/mockTranslate\(BACK\)/)).toBeInTheDocument();
    expect(screen.getByText(/mockTranslate\(NEXT\)/)).toBeInTheDocument();
  });

  it("disables Back button on step 1", () => {
    render(<StepperControl {...defaultProps} currentStep={1} />);
    const backButton = screen
      .getByText(/mockTranslate\(BACK\)/)
      .closest("button");
    expect(backButton).toBeDisabled();
  });

  it("enables Back button on step 2 and above", () => {
    render(<StepperControl {...defaultProps} currentStep={2} />);
    const backButton = screen
      .getByText(/mockTranslate\(BACK\)/)
      .closest("button");
    expect(backButton).not.toBeDisabled();
  });

  it("shows Confirm button on step 4 (steps.length - 1)", () => {
    render(<StepperControl {...defaultProps} currentStep={4} />);
    expect(screen.getByText(/mockTranslate\(CONFIRM\)/)).toBeInTheDocument();
  });

  it("shows Next button on steps before step 4", () => {
    render(<StepperControl {...defaultProps} currentStep={3} />);
    expect(screen.getByText(/mockTranslate\(NEXT\)/)).toBeInTheDocument();
  });

  it("disables Next button when isAcknowledged is false on step 1", () => {
    render(
      <StepperControl
        {...defaultProps}
        currentStep={1}
        isAcknowledged={false}
      />,
    );
    const nextButton = screen
      .getByText(/mockTranslate\(NEXT\)/)
      .closest("button");
    expect(nextButton).toBeDisabled();
  });

  it("disables Next button when isUploaded is false on step 2", () => {
    render(
      <StepperControl {...defaultProps} currentStep={2} isUploaded={false} />,
    );
    const nextButton = screen
      .getByText(/mockTranslate\(NEXT\)/)
      .closest("button");
    expect(nextButton).toBeDisabled();
  });

  it("disables Confirm button when isAvailabilityValid is false on step 4", () => {
    render(
      <StepperControl
        {...defaultProps}
        currentStep={4}
        isAvailabilityValid={false}
      />,
    );
    const confirmButton = screen
      .getByText(/mockTranslate\(CONFIRM\)/)
      .closest("button");
    expect(confirmButton).toBeDisabled();
  });

  it("disables Next button when currentStep >= steps.length", () => {
    render(<StepperControl {...defaultProps} currentStep={5} />);
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[1];
    expect(nextButton).toBeDisabled();
  });

  it("calls handleClick with 'prev' when Back button is clicked", () => {
    const handleClick = jest.fn();
    render(
      <StepperControl
        {...defaultProps}
        currentStep={2}
        handleClick={handleClick}
      />,
    );
    const backButton = screen
      .getByText(/mockTranslate\(BACK\)/)
      .closest("button");
    fireEvent.click(backButton);
    expect(handleClick).toHaveBeenCalledWith("prev");
  });

  it("calls handleClick with 'next' when Next button is clicked", () => {
    const handleClick = jest.fn();
    render(
      <StepperControl
        {...defaultProps}
        currentStep={2}
        handleClick={handleClick}
      />,
    );
    const nextButton = screen
      .getByText(/mockTranslate\(NEXT\)/)
      .closest("button");
    fireEvent.click(nextButton);
    expect(handleClick).toHaveBeenCalledWith("next");
  });
});
