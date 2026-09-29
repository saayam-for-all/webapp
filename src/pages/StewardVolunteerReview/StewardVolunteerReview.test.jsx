import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StewardVolunteerReview from "./StewardVolunteerReview";

jest.mock("react-router-dom", () => jest.requireActual("react-router-dom"));

const renderReview = (state = {}) =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/steward-volunteer-review",
          state,
        },
      ]}
    >
      <StewardVolunteerReview />
    </MemoryRouter>,
  );

describe("StewardVolunteerReview", () => {
  test("renders applicant information supplied by the steward dashboard", () => {
    renderReview({
      userId: "SID-123",
      name: "Test Applicant",
      email: "applicant@example.com",
      phone: "+1 (555) 123-4567",
      "Updated Time": "9/29/2026, 1:00:00 PM",
    });

    expect(screen.getAllByText("Test Applicant").length).toBeGreaterThan(0);
    expect(screen.getByText("SID-123")).toBeInTheDocument();
    expect(screen.getByText("applicant@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1 (555) 123-4567")).toBeInTheDocument();

    expect(
      screen.getByText("Submitted on: 9/29/2026, 1:00:00 PM"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Call applicant" }),
    ).toHaveAttribute("href", "tel:+1 (555) 123-4567");

    expect(
      screen.getByRole("link", { name: "Message applicant on WhatsApp" }),
    ).toHaveAttribute("href", "https://wa.me/15551234567");
  });

  test("renders skills, availability, and government ID data when provided", () => {
    renderReview({
      userId: "SID-456",
      govtIdFilename: "drivers-license.pdf",
      skills: ["Tutoring", "Medication Management"],
      availability: [
        {
          dayOfWeek: "Monday",
          startTime: "9:30 AM",
          endTime: "12:00 PM",
        },
      ],
    });

    expect(screen.getByText("drivers-license.pdf")).toBeInTheDocument();
    expect(screen.getByText("2 selected")).toBeInTheDocument();
    expect(screen.getByText("1 time slot selected")).toBeInTheDocument();
    expect(screen.getByText("Tutoring")).toBeInTheDocument();
    expect(screen.getByText("Medication Management")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("9:30 AM - 12:00 PM")).toBeInTheDocument();
  });

  test("shows safe fallbacks when application details are unavailable", () => {
    renderReview({
      "User Id": "SID-789",
      "Updated Time": "9/29/2026",
    });

    expect(screen.getByText("SID-789")).toBeInTheDocument();
    expect(screen.getAllByText("N/A").length).toBeGreaterThanOrEqual(3);

    expect(
      screen.getByText("Government ID information is not available."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Skill information is not available."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Availability information is not available."),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: "Call applicant" }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: "Message applicant on WhatsApp" }),
    ).not.toBeInTheDocument();
  });

  test("renders steward review actions", () => {
    renderReview({ userId: "SID-999" });

    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Promote" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Request More Information" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Replace with applicant name"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("4 selected")).not.toBeInTheDocument();
    expect(screen.queryByText("ID Document")).not.toBeInTheDocument();
  });
});
