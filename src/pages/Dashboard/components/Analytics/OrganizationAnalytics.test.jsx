import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import OrganizationAnalytics from "./OrganizationAnalytics";

jest.mock("./SizeContributionAnalytics", () => ({
  __esModule: true,
  default: () => <div>Size Contribution Content</div>,
}));

describe("OrganizationAnalytics", () => {
  it("renders header and all three sub-tabs", () => {
    render(<OrganizationAnalytics />);
    expect(screen.getByText("Organization Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Growth & Location")).toBeInTheDocument();
    expect(screen.getByText("Size & Contribution")).toBeInTheDocument();
    expect(screen.getByText("Rating & Type")).toBeInTheDocument();
  });

  it("shows Size & Contribution by default", () => {
    render(<OrganizationAnalytics />);
    expect(screen.getByText("Size Contribution Content")).toBeInTheDocument();
  });

  it("switches to placeholder sub-tabs", () => {
    render(<OrganizationAnalytics />);
    fireEvent.click(screen.getByText("Growth & Location"));
    expect(
      screen.getByText("Growth & Location analytics coming soon."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Rating & Type"));
    expect(
      screen.getByText("Rating & Type analytics coming soon."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Size Contribution Content"),
    ).not.toBeInTheDocument();
  });
});
