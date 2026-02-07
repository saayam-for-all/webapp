import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Review from "./Review";

jest.mock("react-router-dom");
jest.mock("react-i18next");

describe("Review", () => {
  it("renders correctly", () => {
    const { container } = render(<Review />);
    expect(container).toMatchSnapshot();
  });

  it("displays the In Review status", () => {
    render(<Review />);
    expect(screen.getByText(/mockTranslate\(IN_REVIEW\)/)).toBeInTheDocument();
  });

  it("displays the review status message", () => {
    render(<Review />);
    expect(
      screen.getByText(/mockTranslate\(REVIEW_STATUS_MESSAGE\)/),
    ).toBeInTheDocument();
  });

  it("displays the approval message", () => {
    render(<Review />);
    expect(
      screen.getByText(/mockTranslate\(REVIEW_APPROVAL_MESSAGE\)/),
    ).toBeInTheDocument();
  });

  it("renders the Close button with link to dashboard", () => {
    render(<Review />);
    const closeButton = screen.getByRole("button");
    expect(closeButton).toBeInTheDocument();
    expect(screen.getByText(/mockTranslate\(CLOSE\)/)).toBeInTheDocument();
  });

  it("has a link to the dashboard", () => {
    render(<Review />);
    const link = screen
      .getByText(/mockTranslate\(CLOSE\)/)
      .closest("mock-link");
    expect(link).toHaveAttribute("to", "/dashboard");
  });
});
