import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import OrganizationAnalytics from "./OrganizationAnalytics";

jest.mock("./GrowthLocationAnalytics", () => {
  const MockGrowthLocation = () => <div data-testid="growth-location" />;
  return MockGrowthLocation;
});

describe("OrganizationAnalytics", () => {
  it("renders the Organization Dashboard title and sub-tabs", () => {
    render(<OrganizationAnalytics />);
    expect(screen.getByText("Organization Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Growth & Location")).toBeInTheDocument();
    expect(screen.getByText("Size & Contribution")).toBeInTheDocument();
    expect(screen.getByText("Rating & Type")).toBeInTheDocument();
  });

  it("shows Growth & Location by default and switches tabs", () => {
    render(<OrganizationAnalytics />);
    expect(screen.getByTestId("growth-location")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Size & Contribution"));
    expect(screen.queryByTestId("growth-location")).not.toBeInTheDocument();
    expect(screen.getByText("Coming soon.")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Growth & Location"));
    expect(screen.getByTestId("growth-location")).toBeInTheDocument();
  });
});
