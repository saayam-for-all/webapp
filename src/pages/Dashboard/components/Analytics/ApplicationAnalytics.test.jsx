import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ApplicationAnalytics from "./ApplicationAnalytics";

// Each tab fetches its own data; only the tab switching is under test here.
jest.mock("./RequestsAnalytics", () => () => <div>Requests view</div>);
jest.mock("./KPIAnalytics", () => () => <div>KPI view</div>);
jest.mock("./BeneficiariesAnalytics", () => () => (
  <div>Beneficiaries view</div>
));
jest.mock("./VolunteerAnalytics", () => () => <div>Volunteers view</div>);
jest.mock("./OrganizationAnalytics", () => () => <div>Organization view</div>);

describe("ApplicationAnalytics", () => {
  it("shows Requests first and opens each tab, including Organization", () => {
    render(<ApplicationAnalytics />);
    expect(screen.getByText("Requests view")).toBeInTheDocument();

    for (const tab of ["KPI", "Beneficiaries", "Volunteers", "Organization"]) {
      fireEvent.click(screen.getByRole("button", { name: tab }));
      expect(screen.getByText(`${tab} view`)).toBeInTheDocument();
    }
    expect(screen.queryByText("Requests view")).not.toBeInTheDocument();
  });
});
