import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpingVolunteers from "./HelpingVolunteers";
import * as meetingServices from "../../services/meetingServices";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

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

  it("shows loading spinner when fetching volunteers", async () => {
    const { getVolunteersData } = require("../../services/volunteerServices");
    getVolunteersData.mockImplementationOnce(() => new Promise(() => {}));
    render(<HelpingVolunteers />);
    expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders fallback UI for volunteersCount = 0", async () => {
    render(<HelpingVolunteers />);
    const countInput = screen.getByRole("spinbutton");
    fireEvent.change(countInput, { target: { value: "0" } });
    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));
    expect(screen.getAllByText(/Volunteers/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Assigned/)).toBeInTheDocument();
    const dateRegex = /\w{3} \d{1,2}, \d{4}, \d{1,2}:\d{2} (AM|PM)/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });

  it("renders fallback UI for negative volunteersCount", async () => {
    render(<HelpingVolunteers />);
    const countInput = screen.getByRole("spinbutton");
    fireEvent.change(countInput, { target: { value: "-5" } });
    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));
    expect(screen.getAllByText(/Volunteers/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Assigned/)).toBeInTheDocument();
    const dateRegex = /\w{3} \d{1,2}, \d{4}, \d{1,2}:\d{2} (AM|PM)/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });

  it("shows error if volunteers API fails", async () => {
    const { getVolunteersData } = require("../../services/volunteerServices");
    getVolunteersData.mockImplementationOnce(() =>
      Promise.reject(new Error("API error")),
    );
    render(<HelpingVolunteers />);
    await waitFor(() => {
      expect(
        screen.getByText(/API error|Failed to fetch volunteers/i),
      ).toBeInTheDocument();
    });
  });

  it("shows TODO message when Confirm is clicked with valid inputs", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
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
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
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
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    fireEvent.change(screen.getAllByLabelText(/Date/i)[0], {
      target: { value: "2026-03-10" },
    });
    fireEvent.change(screen.getAllByLabelText(/Time/i)[0], {
      target: { value: "12:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(
      screen.queryByText(/Schedule Zoom Meeting/i),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    expect(screen.getAllByLabelText(/Date/i)[0].value).toBe("");
    expect(screen.getAllByLabelText(/Time/i)[0].value).toBe("");
  });

  it("resets modal state when close (×) button is clicked", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    fireEvent.change(screen.getAllByLabelText(/Date/i)[0], {
      target: { value: "2026-03-10" },
    });
    fireEvent.change(screen.getAllByLabelText(/Time/i)[0], {
      target: { value: "12:00" },
    });
    fireEvent.click(screen.getByLabelText("Close"));
    expect(
      screen.queryByText(/Schedule Zoom Meeting/i),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    expect(screen.getAllByLabelText(/Date/i)[0].value).toBe("");
    expect(screen.getAllByLabelText(/Time/i)[0].value).toBe("");
  });

  it("shows TODO message when meeting is confirmed", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
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
    fireEvent.change(
      screen.getByPlaceholderText("mockTranslate(SEARCH_BY_NAME)"),
      { target: { value: "John" } },
    );
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
    expect(screen.getAllByText(/Volunteers/).length).toBeGreaterThan(0);
  });

  it("handles min and max volunteers count", async () => {
    render(<HelpingVolunteers />);
    const countInput = screen.getByRole("spinbutton");
    fireEvent.change(countInput, { target: { value: "1" } });
    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));
    await waitFor(() => {
      expect(screen.getByText("Jane Cooper")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
    fireEvent.change(countInput, { target: { value: "10" } });
    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));
    await waitFor(() => {
      expect(
        screen.getByText(/Maximum 5 volunteer can be assigned/i),
      ).toBeInTheDocument();
      expect(screen.queryByText("Jane Cooper")).not.toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  it("renders badge and formatted date", async () => {
    render(<HelpingVolunteers />);
    expect(await screen.findByText(/Assigned/)).toBeInTheDocument();
    expect(screen.getByText(/Volunteers Requested/)).toBeInTheDocument();
    const dateRegex = /\w{3} \d{1,2}, \d{4}, \d{1,2}:\d{2} (AM|PM)/;
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
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
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    expect(screen.getByRole("button", { name: /Zoom Meeting/i })).toBeEnabled();
  });

  it("opens modal and validates date/time input", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    expect(screen.getByText(/Schedule Zoom Meeting/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Confirm/i));
    expect(
      await screen.findByText(/Please select both date and time/i),
    ).toBeInTheDocument();
  });

  it("calls meeting creation and shows success", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
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
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
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
    await screen.findByText("Jane Cooper");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
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
  });

  it("renders the search-by dropdown with Name, Email, and Phone options", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    expect(
      screen.getByDisplayValue("mockTranslate(FIND_BY_NAME)"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "mockTranslate(FIND_BY_NAME)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "mockTranslate(FIND_BY_EMAIL)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "mockTranslate(FIND_BY_PHONE)" }),
    ).toBeInTheDocument();
  });

  it("shows Enter volunteer name placeholder by default", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    expect(
      screen.getByPlaceholderText("mockTranslate(ENTER_VOLUNTEER_NAME)"),
    ).toBeInTheDocument();
  });

  it("changes placeholder to Enter volunteer email when Email is selected", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const searchBySelect = screen.getByDisplayValue(
      "mockTranslate(FIND_BY_NAME)",
    );
    fireEvent.change(searchBySelect, { target: { value: "email" } });
    expect(
      screen.getByPlaceholderText("mockTranslate(ENTER_VOLUNTEER_EMAIL)"),
    ).toBeInTheDocument();
  });

  it("changes placeholder to Enter volunteer phone when Phone is selected", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const searchBySelect = screen.getByDisplayValue(
      "mockTranslate(FIND_BY_NAME)",
    );
    fireEvent.change(searchBySelect, { target: { value: "phone" } });
    expect(
      screen.getByPlaceholderText("mockTranslate(ENTER_VOLUNTEER_PHONE)"),
    ).toBeInTheDocument();
  });

  it("restores Enter volunteer name placeholder when Name is reselected", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const searchBySelect = screen.getByDisplayValue(
      "mockTranslate(FIND_BY_NAME)",
    );
    fireEvent.change(searchBySelect, { target: { value: "email" } });
    fireEvent.change(searchBySelect, { target: { value: "name" } });
    expect(
      screen.getByPlaceholderText("mockTranslate(ENTER_VOLUNTEER_NAME)"),
    ).toBeInTheDocument();
  });

  // ── New tests for issue #1522 ─────────────────────────────────────────────

  it("renders select-all checkbox in the table header", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: /Select all volunteers on this page/i,
    });
    expect(selectAllCheckbox).toBeInTheDocument();
    expect(selectAllCheckbox).not.toBeChecked();
  });

  it("select-all checkbox selects all volunteers on current page", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: /Select all volunteers on this page/i,
    });
    fireEvent.click(selectAllCheckbox);
    expect(screen.getByRole("button", { name: /Zoom Meeting/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Delete/i })).toBeEnabled();
  });

  it("select-all checkbox is checked when all rows on page are selected", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const allCheckboxes = screen.getAllByRole("checkbox");
    fireEvent.click(allCheckboxes[1]);
    fireEvent.click(allCheckboxes[2]);
    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: /Select all volunteers on this page/i,
    });
    expect(selectAllCheckbox).toBeChecked();
  });

  it("unchecking select-all deselects all volunteers on current page", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: /Select all volunteers on this page/i,
    });
    fireEvent.click(selectAllCheckbox);
    expect(screen.getByRole("button", { name: /Zoom Meeting/i })).toBeEnabled();
    fireEvent.click(selectAllCheckbox);
    expect(
      screen.getByRole("button", { name: /Zoom Meeting/i }),
    ).toBeDisabled();
  });

  it("renders volunteer names as hyperlinks to /profile", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const janeLink = screen.getByRole("link", { name: "Jane Cooper" });
    const johnLink = screen.getByRole("link", { name: "John Doe" });
    expect(janeLink).toBeInTheDocument();
    expect(janeLink).toHaveAttribute("href", "/profile");
    expect(johnLink).toBeInTheDocument();
    expect(johnLink).toHaveAttribute("href", "/profile");
  });

  it("volunteer name links have correct styling class", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    const janeLink = screen.getByRole("link", { name: "Jane Cooper" });
    expect(janeLink).toHaveClass("text-blue-600");
  });
});
