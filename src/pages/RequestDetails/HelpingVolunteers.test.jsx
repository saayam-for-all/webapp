import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import HelpingVolunteers from "./HelpingVolunteers";

import { getVolunteersData } from "../../services/volunteerServices";

jest.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock("../../services/volunteerServices", () => ({
  getVolunteersData: jest.fn(),
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
    fireEvent.change(input, { target: { value: "Jane" } });
    expect(input.value).toBe("Jane");
  });

  it("renders request volunteers button", async () => {
    render(<HelpingVolunteers />);
    expect(await screen.findByText(/REQUEST_VOLUNTEERS/i)).toBeInTheDocument();
  });

  it("shows validation error for more than 5 volunteers", async () => {
    render(<HelpingVolunteers />);
    const input = await screen.findByRole("spinbutton");
    fireEvent.change(input, { target: { value: "10" } });
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

  // ---------------------------------------------------------------------------
  // Added: exercise the RELOCATED buttons + modal so the lines moved in this PR
  // actually execute under test (this is what raises patch coverage).
  // ---------------------------------------------------------------------------

  // Selecting via the header "select all" checkbox enables the Zoom/Delete
  // buttons, which are disabled while nothing is selected.
  const selectAll = async () => {
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
  };

  it("opens the Zoom meeting modal", async () => {
    render(<HelpingVolunteers />);
    await selectAll();

    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));

    expect(
      await screen.findByText("Schedule Zoom Meeting"),
    ).toBeInTheDocument();
  });

  it("validates missing date/time in the modal", async () => {
    render(<HelpingVolunteers />);
    await selectAll();
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));

    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    expect(
      await screen.findByText(/Please select both date and time/i),
    ).toBeInTheDocument();
  });

  it("submits the modal when date and time are provided", async () => {
    render(<HelpingVolunteers />);
    await selectAll();
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));

    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2099-12-31" },
    });
    fireEvent.change(screen.getByLabelText("Time"), {
      target: { value: "10:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    expect(
      await screen.findByText(/Need to integrate with backend/i),
    ).toBeInTheDocument();
  });

  it("closes the modal via Cancel", async () => {
    render(<HelpingVolunteers />);
    await selectAll();
    fireEvent.click(screen.getByRole("button", { name: /Zoom Meeting/i }));
    await screen.findByText("Schedule Zoom Meeting");

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    await waitFor(() => {
      expect(
        screen.queryByText("Schedule Zoom Meeting"),
      ).not.toBeInTheDocument();
    });
  });

  it("deletes the selected volunteers", async () => {
    render(<HelpingVolunteers />);
    await screen.findByText("Jane Cooper");
    await selectAll();

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(screen.queryByText("Jane Cooper")).not.toBeInTheDocument();
    });
  });

  it("changes the sort option", async () => {
    render(<HelpingVolunteers />);
    const sortSelect = await screen.findByDisplayValue("Sort by: Newest");

    fireEvent.change(sortSelect, { target: { value: "Oldest" } });
    fireEvent.change(sortSelect, { target: { value: "Name" } });

    expect(sortSelect.value).toBe("Name");
  });

  it("changes the cause filter", async () => {
    render(<HelpingVolunteers />);
    const filterSelect = await screen.findByDisplayValue(
      "Filter by: All Causes",
    );

    fireEvent.change(filterSelect, { target: { value: "Cooking" } });

    expect(filterSelect.value).toBe("Cooking");
  });
});
