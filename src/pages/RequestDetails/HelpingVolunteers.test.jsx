import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpingVolunteers from "./HelpingVolunteers";
import * as meetingServices from "../../services/meetingServices";

jest.mock("../../services/meetingServices");
jest.mock("../../services/volunteerServices", () => ({
  getVolunteersData: jest.fn(() =>
    Promise.resolve([
      {
        name: "Jane Cooper",
        cause: "Cooking",
        phone: "123",
        email: "jane@example.com",
        location: "Boston",
        rating: "★★★★★",
        dateAdded: "2023-10-01",
      },
      {
        name: "John Doe",
        cause: "Medical",
        phone: "456",
        email: "john@example.com",
        location: "NYC",
        rating: "★★★☆☆",
        dateAdded: "2023-10-02",
      },
    ]),
  ),
}));

describe("HelpingVolunteers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders volunteer list and disables Zoom Meeting button initially", async () => {
    render(<HelpingVolunteers />);
    expect(await screen.findByText("Jane Cooper")).toBeInTheDocument();
    expect(screen.getByText("Zoom Meeting")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Zoom Meeting/i }),
    ).toBeDisabled();
  });

  it("enables Zoom Meeting button when a volunteer is selected", async () => {
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    expect(screen.getByRole("button", { name: /Zoom Meeting/i })).toBeEnabled();
  });

  it("opens modal and validates date/time input", async () => {
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    expect(screen.getByText(/Schedule Zoom Meeting/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Confirm/i));
    expect(
      await screen.findByText(/Please select both date and time/i),
    ).toBeInTheDocument();
  });

  it("calls meeting creation and shows success", async () => {
    meetingServices.createZoomMeeting.mockResolvedValue({
      zoomLink: "link",
      meetingId: "id",
    });
    meetingServices.storeMeetingDetails.mockResolvedValue({});
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2026-03-10" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:00" },
    });
    fireEvent.click(screen.getByText(/Confirm/i));
    await waitFor(() =>
      expect(
        screen.getByText(/Meeting scheduled and invitations sent!/i),
      ).toBeInTheDocument(),
    );
  });

  it("shows error if meeting creation fails", async () => {
    meetingServices.createZoomMeeting.mockRejectedValue(
      new Error("Zoom error"),
    );
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2026-03-10" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:00" },
    });
    fireEvent.click(screen.getByText(/Confirm/i));
    expect(await screen.findByText(/Zoom error/i)).toBeInTheDocument();
  });

  it("closes modal and resets state on cancel", async () => {
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2026-03-10" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:00" },
    });
    fireEvent.click(screen.getByText(/Cancel/i));
    await waitFor(() =>
      expect(
        screen.queryByText(/Schedule Zoom Meeting/i),
      ).not.toBeInTheDocument(),
    );
  });

  it("handles pagination and sorting", async () => {
    render(<HelpingVolunteers />);
    expect(await screen.findByText("Jane Cooper")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Rows per view/i), {
      target: { value: "5" },
    });
    fireEvent.click(screen.getByText("Sort by: Name"));
    fireEvent.click(screen.getByText("Sort by: Oldest"));
    fireEvent.click(screen.getByText("Sort by: Newest"));
    // No crash = pass
  });
});
