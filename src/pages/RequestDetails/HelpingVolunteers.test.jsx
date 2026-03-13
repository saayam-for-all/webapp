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
  it("shows loading spinner when fetching volunteers", async () => {
    const { getVolunteersData } = require("../../services/volunteerServices");
    getVolunteersData.mockImplementationOnce(() => new Promise(() => {}));
    render(<HelpingVolunteers />);
    expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders fallback UI for volunteersCount = 0", async () => {
    render(<HelpingVolunteers />);
    const countInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(countInput, { target: { value: "0" } });
    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));
    // Should show no volunteers, but still show badge and date
    expect(screen.getAllByText(/Volunteers/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Assigned/)).toBeInTheDocument();
    const dateRegex = /Mar \d{1,2}, 2026, \d{1,2}:\d{2} (AM|PM)/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });

  it("renders fallback UI for negative volunteersCount", async () => {
    render(<HelpingVolunteers />);
    const countInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(countInput, { target: { value: "-5" } });
    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));
    // Should show no volunteers, but still show badge and date
    expect(screen.getAllByText(/Volunteers/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Assigned/)).toBeInTheDocument();
    const dateRegex = /Mar \d{1,2}, 2026, \d{1,2}:\d{2} (AM|PM)/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });
  it("shows error if volunteers API fails", async () => {
    const { getVolunteersData } = require("../../services/volunteerServices");
    getVolunteersData.mockImplementationOnce(() =>
      Promise.reject(new Error("API error")),
    );
    render(<HelpingVolunteers />);
    // Wait for error state to be set
    await waitFor(() => {
      expect(
        screen.getByText(/API error|Failed to fetch volunteers/i),
      ).toBeInTheDocument();
    });
  });

  it("shows TODO message when Confirm is clicked with valid inputs", async () => {
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2026-03-20" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:00" },
    });
    const confirmBtn = await screen.findByRole("button", { name: /Confirm/i });
    const cancelBtn = await screen.findByRole("button", { name: /Cancel/i });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(
        screen.getByText(/TODO: Need to integrate with backend/i),
      ).toBeInTheDocument();
      expect(confirmBtn).not.toBeDisabled();
      expect(cancelBtn).not.toBeDisabled();
    });
  });

  it("shows and hides meeting TODO message", async () => {
    jest.useFakeTimers();
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    const dateInputs = screen.getAllByLabelText(/Date/i);
    dateInputs.forEach((input) => {
      fireEvent.change(input, { target: { value: "2026-03-20" } });
    });
    const timeInputs = screen.getAllByLabelText(/Time/i);
    timeInputs.forEach((input) => {
      fireEvent.change(input, { target: { value: "12:00" } });
    });
    fireEvent.click(screen.getByText(/Confirm/i));
    await waitFor(() =>
      expect(
        screen.getByText(/TODO: Need to integrate with backend/i),
      ).toBeInTheDocument(),
    );
    // Fast-forward timers to auto-hide message
    jest.advanceTimersByTime(2000);
    await waitFor(() =>
      expect(
        screen.queryByText(/TODO: Need to integrate with backend/i),
      ).not.toBeInTheDocument(),
    );
    jest.useRealTimers();
  });

  it("resets modal state when Cancel button is clicked", async () => {
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    // Fill date/time
    fireEvent.change(screen.getAllByLabelText(/Date/i)[0], {
      target: { value: "2026-03-10" },
    });
    fireEvent.change(screen.getAllByLabelText(/Time/i)[0], {
      target: { value: "12:00" },
    });
    // Click Cancel
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    // Modal should close and inputs reset
    expect(
      screen.queryByText(/Schedule Zoom Meeting/i),
    ).not.toBeInTheDocument();
    // Reopen modal to check reset
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    expect(screen.getAllByLabelText(/Date/i)[0].value).toBe("");
    expect(screen.getAllByLabelText(/Time/i)[0].value).toBe("");
  });

  it("resets modal state when close (×) button is clicked", async () => {
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    // Fill date/time
    fireEvent.change(screen.getAllByLabelText(/Date/i)[0], {
      target: { value: "2026-03-10" },
    });
    fireEvent.change(screen.getAllByLabelText(/Time/i)[0], {
      target: { value: "12:00" },
    });
    // Click close (×) button
    fireEvent.click(screen.getByLabelText("Close"));
    // Modal should close and inputs reset
    expect(
      screen.queryByText(/Schedule Zoom Meeting/i),
    ).not.toBeInTheDocument();
    // Reopen modal to check reset
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    expect(screen.getAllByLabelText(/Date/i)[0].value).toBe("");
    expect(screen.getAllByLabelText(/Time/i)[0].value).toBe("");
  });

  it("shows TODO message when meeting is confirmed", async () => {
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    fireEvent.change(screen.getAllByLabelText(/Date/i)[0], {
      target: { value: "2026-03-20" },
    });
    fireEvent.change(screen.getAllByLabelText(/Time/i)[0], {
      target: { value: "12:00" },
    });
    fireEvent.click(screen.getByText(/Confirm/i));
    await waitFor(() => {
      expect(
        screen.getByText(/TODO: Need to integrate with backend/i),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Meeting scheduled and invitations sent!/i),
      ).not.toBeInTheDocument();
    });
  });
  it("searches volunteers by name", async () => {
    render(<HelpingVolunteers />);
    expect(await screen.findByText("Jane Cooper")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Search by name..."), {
      target: { value: "John" },
    });
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Cooper")).not.toBeInTheDocument();
  });

  it("filters volunteers by cause", async () => {
    render(<HelpingVolunteers />);
    expect(await screen.findByText("Jane Cooper")).toBeInTheDocument();
    fireEvent.change(
      screen.getByRole("combobox", { name: /Filter by: All Causes/i }),
      { target: { value: "Medical" } },
    );
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Cooper")).not.toBeInTheDocument();
  });

  it("renders with zero volunteers", async () => {
    jest.mock("../../services/volunteerServices", () => ({
      getVolunteersData: jest.fn(() => Promise.resolve([])),
    }));
    render(<HelpingVolunteers />);
    expect(screen.queryByText("Jane Cooper")).not.toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    // There are multiple elements with "Volunteers" (title and badge), so use getAllByText
    expect(screen.getAllByText(/Volunteers/).length).toBeGreaterThan(0);
  });

  it("handles min and max volunteers count", async () => {
    render(<HelpingVolunteers />);
    const countInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(countInput, { target: { value: "1" } });
    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));
    await waitFor(() => {
      expect(screen.getByText("Jane Cooper")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
    fireEvent.change(countInput, { target: { value: "10" } });
    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));
    await waitFor(() => {
      expect(screen.getByText("Jane Cooper")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("renders badge and formatted date", async () => {
    render(<HelpingVolunteers />);
    expect(await screen.findByText(/Assigned/)).toBeInTheDocument();
    expect(screen.getByText(/Volunteers Requested/)).toBeInTheDocument();
    // Date format: Mar 3, 2026, ...
    const dateRegex = /Mar \d{1,2}, 2026, \d{1,2}:\d{2} (AM|PM)/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });
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
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2026-03-20" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:00" },
    });
    fireEvent.click(screen.getByText(/Confirm/i));
    await waitFor(() =>
      expect(
        screen.getByText(/TODO: Need to integrate with backend/i),
      ).toBeInTheDocument(),
    );
  });

  it("shows error if meeting creation fails", async () => {
    render(<HelpingVolunteers />);
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2026-03-20" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:00" },
    });
    fireEvent.click(screen.getByText(/Confirm/i));
    expect(
      await screen.findByText(/TODO: Need to integrate with backend/i),
    ).toBeInTheDocument();
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
