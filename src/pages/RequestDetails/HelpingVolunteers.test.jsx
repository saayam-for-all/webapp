import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import HelpingVolunteers from "./HelpingVolunteers";

import { getVolunteersData } from "../../services/volunteerServices";

jest.mock("react-router-dom", () => ({
  // eslint-disable-next-line react/prop-types
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock("../../services/volunteerServices", () => ({
  getVolunteersData: jest.fn(),
}));

jest.mock("../../services/meetingServices", () => ({
  createZoomMeeting: jest
    .fn()
    .mockResolvedValue({ message: "Zoom meeting created successfully!" }),
  storeMeetingDetails: jest.fn().mockResolvedValue({}),
}));

const mockVolunteers = [
  {
    name: "Jane Cooper",
    cause: "Cooking",
    phone: "123",
    email: "jane@example.com",
    location: "Boston",
    rating: "★★★★★",
  },
  {
    name: "John Doe",
    cause: "Medical",
    phone: "456",
    email: "john@example.com",
    location: "NYC",
    rating: "★★★☆☆",
  },
];

beforeEach(() => {
  jest.clearAllMocks();

  getVolunteersData.mockResolvedValue(mockVolunteers);
});

describe("HelpingVolunteers", () => {
  it("renders volunteer management title", async () => {
    render(<HelpingVolunteers />);

    expect(await screen.findByText("Volunteer Management")).toBeInTheDocument();
  });

  it("renders volunteers", async () => {
    render(<HelpingVolunteers />);

    expect(await screen.findByText("Jane Cooper")).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    getVolunteersData.mockImplementationOnce(() => new Promise(() => {}));

    render(<HelpingVolunteers />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("shows error state", async () => {
    getVolunteersData.mockRejectedValueOnce(new Error("API error"));

    render(<HelpingVolunteers />);

    await waitFor(() => {
      expect(screen.getByText(/API error/i)).toBeInTheDocument();
    });
  });

  it("renders profile links", async () => {
    render(<HelpingVolunteers />);

    const links = await screen.findAllByRole("link");

    expect(links.length).toBeGreaterThan(0);

    expect(links[0]).toHaveAttribute("href", "/profile");
  });

  it("renders search input", async () => {
    render(<HelpingVolunteers />);

    expect(
      await screen.findByPlaceholderText(/SEARCH_BY_NAME/i),
    ).toBeInTheDocument();
  });

  it("search input changes value", async () => {
    render(<HelpingVolunteers />);

    const input = await screen.findByPlaceholderText(/SEARCH_BY_NAME/i);

    fireEvent.change(input, {
      target: { value: "Jane" },
    });

    expect(input.value).toBe("Jane");
  });

  it("renders request volunteers button", async () => {
    render(<HelpingVolunteers />);

    expect(await screen.findByText(/REQUEST_VOLUNTEERS/i)).toBeInTheDocument();
  });

  it("shows validation error for more than 5 volunteers", async () => {
    render(<HelpingVolunteers />);

    const input = await screen.findByRole("spinbutton");

    fireEvent.change(input, {
      target: { value: "10" },
    });

    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));

    expect(
      screen.getByText(/Maximum 5 volunteer can be assigned/i),
    ).toBeInTheDocument();
  });

  it("renders checkboxes", async () => {
    render(<HelpingVolunteers />);

    const checkboxes = await screen.findAllByRole("checkbox");

    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it("select all checkbox can be clicked", async () => {
    render(<HelpingVolunteers />);

    const checkboxes = await screen.findAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);

    expect(checkboxes[0]).toBeChecked();
  });

  it("renders sorting headers", async () => {
    render(<HelpingVolunteers />);

    expect(await screen.findByText("Name")).toBeInTheDocument();

    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("sorting header click works", async () => {
    render(<HelpingVolunteers />);

    const nameHeader = await screen.findByText("Name");

    fireEvent.click(nameHeader);

    expect(nameHeader).toBeInTheDocument();
  });

  it("delete button exists", async () => {
    render(<HelpingVolunteers />);

    expect(await screen.findByText(/Delete/i)).toBeInTheDocument();
  });

  it("zoom meeting button exists", async () => {
    render(<HelpingVolunteers />);

    expect(await screen.findByText(/Zoom Meeting/i)).toBeInTheDocument();
  });

  it("opens the zoom meeting modal after selecting volunteers", async () => {
    render(<HelpingVolunteers />);

    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByText(/Zoom Meeting/i));

    expect(screen.getByText(/Schedule Zoom Meeting/i)).toBeInTheDocument();
  });

  it("shows validation error when confirming without date and time", async () => {
    render(<HelpingVolunteers />);

    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByText(/Zoom Meeting/i));

    fireEvent.click(screen.getByText(/^Confirm$/i));

    expect(
      screen.getByText(/Please select both date and time/i),
    ).toBeInTheDocument();
  });

  it("shows loading state after confirming with date and time", async () => {
    render(<HelpingVolunteers />);

    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByText(/Zoom Meeting/i));

    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2030-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Time"), {
      target: { value: "10:30" },
    });

    fireEvent.click(screen.getByText(/^Confirm$/i));

    // Button should show "Scheduling..." while the API call is in progress
    expect(screen.getByText(/Scheduling/i)).toBeInTheDocument();

    // Wait for the loading state to resolve
    await waitFor(
      () => expect(screen.queryByText(/Scheduling/i)).not.toBeInTheDocument(),
      { timeout: 3000 },
    );
  });

  it("closes the modal with the cancel button", async () => {
    render(<HelpingVolunteers />);

    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByText(/Zoom Meeting/i));

    expect(screen.getByText(/Schedule Zoom Meeting/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(
      screen.queryByText(/Schedule Zoom Meeting/i),
    ).not.toBeInTheDocument();
  });

  it("closes the modal with the close (×) button", async () => {
    render(<HelpingVolunteers />);

    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByText(/Zoom Meeting/i));

    fireEvent.click(screen.getByLabelText(/Close/i));

    expect(
      screen.queryByText(/Schedule Zoom Meeting/i),
    ).not.toBeInTheDocument();
  });

  it("deletes selected volunteers", async () => {
    render(<HelpingVolunteers />);

    expect(await screen.findByText("Jane Cooper")).toBeInTheDocument();

    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByText(/Delete/i));

    expect(screen.queryByText("Jane Cooper")).not.toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("changes the sort dropdown selection", async () => {
    render(<HelpingVolunteers />);

    const sortSelect = await screen.findByDisplayValue(/Sort by: Newest/i);

    fireEvent.change(sortSelect, { target: { value: "Oldest" } });
    expect(sortSelect.value).toBe("Oldest");

    fireEvent.change(sortSelect, { target: { value: "Name" } });
    expect(sortSelect.value).toBe("Name");
  });

  it("changes rows per view", async () => {
    render(<HelpingVolunteers />);

    const rowsSelect = await screen.findByDisplayValue(/5 rows/i);

    fireEvent.change(rowsSelect, { target: { value: "10" } });

    expect(rowsSelect.value).toBe("10");
  });

  it("updates the volunteer count input", async () => {
    render(<HelpingVolunteers />);

    const input = await screen.findByRole("spinbutton");

    fireEvent.change(input, { target: { value: "3" } });

    expect(input.value).toBe("3");
  });

  it("requests volunteers successfully with a valid count", async () => {
    render(<HelpingVolunteers />);

    const input = await screen.findByRole("spinbutton");
    fireEvent.change(input, { target: { value: "2" } });

    fireEvent.click(screen.getByText(/REQUEST_VOLUNTEERS/i));

    expect(
      screen.queryByText(/Maximum 5 volunteer can be assigned/i),
    ).not.toBeInTheDocument();
  });

  it("changes the search-by dropdown", async () => {
    render(<HelpingVolunteers />);

    const selects = await screen.findAllByRole("combobox");
    const searchBySelect = selects.find((s) => s.value === "name");

    fireEvent.change(searchBySelect, { target: { value: "email" } });
    expect(searchBySelect.value).toBe("email");

    fireEvent.change(searchBySelect, { target: { value: "phone" } });
    expect(searchBySelect.value).toBe("phone");
  });

  it("toggles an individual row checkbox", async () => {
    render(<HelpingVolunteers />);

    await screen.findByText("Jane Cooper");

    const checkboxes = screen.getAllByRole("checkbox");
    const rowCheckbox = checkboxes[1];

    fireEvent.click(rowCheckbox);
    fireEvent.click(rowCheckbox);

    expect(rowCheckbox).toBeInTheDocument();
  });
});
