import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
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
  test("renders applicant name as a link to the profile page", () => {
    renderReview({
      userId: "SID-123",
      name: "Test Applicant",
      "Updated Time": "9/29/2026, 1:00:00 PM",
    });

    expect(screen.getByText("UserId: SID-123")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Test Applicant" }),
    ).toHaveAttribute("href", "/profile");

    expect(
      screen.getByText("Submitted on: 9/29/2026, 1:00:00 PM"),
    ).toBeInTheDocument();
  });

  test("uses mock applicant and government ID values when details are unavailable", () => {
    renderReview({
      "User Id": "SID-456",
      "Updated Time": "9/29/2026",
    });

    expect(screen.getByRole("link", { name: "Jane Doe" })).toHaveAttribute(
      "href",
      "/profile",
    );

    const governmentIdLink = screen.getByRole("link", {
      name: "government-id.pdf",
    });

    expect(governmentIdLink).toHaveAttribute(
      "href",
      "data:text/plain;charset=utf-8,Mock%20government%20ID%20document",
    );
    expect(governmentIdLink).toHaveAttribute("download", "government-id.pdf");
  });

  test("uses supplied government ID filename when provided", () => {
    renderReview({
      userId: "SID-789",
      govtIdFilename: "drivers-license.pdf",
    });

    const governmentIdLink = screen.getByRole("link", {
      name: "drivers-license.pdf",
    });

    expect(governmentIdLink).toHaveAttribute("download", "drivers-license.pdf");
  });

  test("does not render the removed application summary and contact sections", () => {
    renderReview({
      userId: "SID-999",
      name: "Test Applicant",
      email: "applicant@example.com",
      phone: "+1 (555) 123-4567",
    });

    expect(screen.queryByText("Volunteer Application")).not.toBeInTheDocument();
    expect(screen.queryByText("Application Summary")).not.toBeInTheDocument();
    expect(screen.queryByText("applicant@example.com")).not.toBeInTheDocument();
    expect(screen.queryByText("+1 (555) 123-4567")).not.toBeInTheDocument();
  });

  test("opens the rejection reason modal when Reject is selected", () => {
    renderReview({ userId: "SID-1000" });

    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Reject Volunteer")).toBeInTheDocument();
    expect(screen.getByLabelText("Reason for rejection")).toBeInTheDocument();
  });

  test("requires a rejection reason before closing the modal", () => {
    renderReview({ userId: "SID-1001" });

    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    const dialog = screen.getByRole("dialog");
    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });

    fireEvent.click(rejectButtons[rejectButtons.length - 1]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Reason for rejection"), {
      target: { value: "Application information is incomplete." },
    });

    fireEvent.click(
      screen.getAllByRole("button", { name: "Reject" }).slice(-1)[0],
    );

    expect(dialog).not.toBeInTheDocument();
  });

  test("renders steward review actions", () => {
    renderReview({ userId: "SID-1002" });

    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Promote" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Request More Information" }),
    ).toBeInTheDocument();
  });

  test("renders volunteering skills and availability", () => {
    renderReview({ userId: "SID-1003" });

    expect(screen.getByText("Volunteering Skills")).toBeInTheDocument();
    expect(screen.getByText(/Clothing Assistance/)).toBeInTheDocument();
    expect(screen.getByText(/Donate Clothes/)).toBeInTheDocument();
    expect(
      screen.getByText(/Elderly Community Assistance/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Medication Management/)).toBeInTheDocument();
    expect(screen.getByText(/Education & Career Support/)).toBeInTheDocument();
    expect(screen.getByText(/Mathematics/)).toBeInTheDocument();
    expect(screen.getByText(/Science/)).toBeInTheDocument();
    expect(screen.getByText(/Healthcare & Wellness/)).toBeInTheDocument();
    expect(screen.getByText(/Medical Consultation/)).toBeInTheDocument();
    expect(screen.getByText(/Skin \/ Dermatology/)).toBeInTheDocument();

    expect(screen.getByText(/Availability/)).toBeInTheDocument();
    expect(screen.getByText("4 slots selected")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Wednesday")).toBeInTheDocument();
    expect(screen.getByText("Saturday")).toBeInTheDocument();
    expect(screen.getByText("9:30AM - 12:00PM")).toBeInTheDocument();
    expect(screen.getByText("12:00PM - 5:00PM")).toBeInTheDocument();
    expect(screen.getByText("10:00AM - 1:00PM")).toBeInTheDocument();
  });

  test("opens and cancels the request information dialog", () => {
    renderReview({ userId: "SID-1004" });

    fireEvent.click(
      screen.getByRole("button", { name: "Request More Information" }),
    );

    expect(screen.getByText("Request Information")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your message..."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByText("Request Information")).not.toBeInTheDocument();
  });

  test("allows a steward to enter and send a request information message", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    renderReview({ userId: "SID-1005" });

    fireEvent.click(
      screen.getByRole("button", { name: "Request More Information" }),
    );

    const messageInput = screen.getByPlaceholderText("Enter your message...");

    fireEvent.change(messageInput, {
      target: { value: "Please provide additional volunteer information." },
    });

    expect(messageInput).toHaveValue(
      "Please provide additional volunteer information.",
    );

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(consoleSpy).toHaveBeenCalledWith(
      "Request message:",
      "Please provide additional volunteer information.",
    );
    expect(screen.queryByText("Request Information")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
