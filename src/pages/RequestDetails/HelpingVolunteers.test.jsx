import "@testing-library/jest-dom";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import HelpingVolunteers from "./HelpingVolunteers";

import { getVolunteersData } from "../../services/volunteerServices";

const mockVolunteers = [
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
];

beforeEach(() => {
  jest.clearAllMocks();
  getVolunteersData.mockResolvedValue(mockVolunteers);
});

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

async function renderAndGetCheckboxes() {
  render(<HelpingVolunteers />);
  await screen.findByText("Jane Cooper");
  return screen.getAllByRole("checkbox");
}

describe("HelpingVolunteers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner when fetching volunteers", async () => {
    const { getVolunteersData } = require("../../services/volunteerServices");

    getVolunteersData.mockImplementationOnce(
      () => new Promise(() => {}),
    );

    render(<HelpingVolunteers />);

    expect(
      await screen.findByText(/Loading.../i),
    ).toBeInTheDocument();
  });

  it("renders fallback UI for volunteersCount = 0", async () => {
    render(<HelpingVolunteers />);

    const countInput = screen.getByRole("spinbutton");

    fireEvent.change(countInput, {
      target: { value: "0" },
    });

    fireEvent.click(
      screen.getByText(/REQUEST_VOLUNTEERS/i),
    );

    expect(
      screen.getAllByText(/Volunteers/).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByText(/Assigned/),
    ).toBeInTheDocument();
  });

  it("shows error if volunteers API fails", async () => {
    const { getVolunteersData } = require("../../services/volunteerServices");

    getVolunteersData.mockImplementationOnce(() =>
      Promise.reject(new Error("API error")),
    );

    render(<HelpingVolunteers />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /API error|Failed to fetch volunteers/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("renders volunteer list and disables Zoom Meeting button initially", async () => {
    render(<HelpingVolunteers />);

    expect(
      await screen.findByText("Jane Cooper"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Zoom Meeting"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Zoom Meeting/i,
      }),
    ).toBeDisabled();
  });

  it("enables Zoom Meeting button when a volunteer is selected", async () => {
    const checkboxes =
      await renderAndGetCheckboxes();

    fireEvent.click(checkboxes[1]);

    expect(
      screen.getByRole("button", {
        name: /Zoom Meeting/i,
      }),
    ).toBeEnabled();
  });

  it("renders select-all checkbox in the table header", async () => {
    render(<HelpingVolunteers />);

    await screen.findByText("Jane Cooper");

    const selectAllCheckbox =
      screen.getByRole("checkbox", {
        name: /Select all volunteers on this page/i,
      });

    expect(selectAllCheckbox).toBeInTheDocument();

    expect(selectAllCheckbox).not.toBeChecked();
  });

  it("select-all checkbox selects all volunteers on current page", async () => {
    render(<HelpingVolunteers />);

    await screen.findByText("Jane Cooper");

    const selectAllCheckbox =
      screen.getByRole("checkbox", {
        name: /Select all volunteers on this page/i,
      });

    fireEvent.click(selectAllCheckbox);

    expect(
      screen.getByRole("button", {
        name: /Zoom Meeting/i,
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: /Delete/i,
      }),
    ).toBeEnabled();
  });

  it("select-all checkbox is checked when all rows on page are selected", async () => {
    render(<HelpingVolunteers />);

    await screen.findByText("Jane Cooper");

    const allCheckboxes =
      screen.getAllByRole("checkbox");

    fireEvent.click(allCheckboxes[1]);
    fireEvent.click(allCheckboxes[2]);

    const selectAllCheckbox =
      screen.getByRole("checkbox", {
        name: /Select all volunteers on this page/i,
      });

    expect(selectAllCheckbox).toBeChecked();
  });

  it("unchecking select-all deselects all volunteers on current page", async () => {
    render(<HelpingVolunteers />);

    await screen.findByText("Jane Cooper");

    const selectAllCheckbox =
      screen.getByRole("checkbox", {
        name: /Select all volunteers on this page/i,
      });

    fireEvent.click(selectAllCheckbox);

    expect(
      screen.getByRole("button", {
        name: /Zoom Meeting/i,
      }),
    ).toBeEnabled();

    fireEvent.click(selectAllCheckbox);

    expect(
      screen.getByRole("button", {
        name: /Zoom Meeting/i,
      }),
    ).toBeDisabled();
  });

  it("renders volunteer names as hyperlinks to /profile", async () => {
    render(<HelpingVolunteers />);

    await screen.findByText("Jane Cooper");

    const janeLink = screen.getByRole("link", {
      name: "Jane Cooper",
    });

    const johnLink = screen.getByRole("link", {
      name: "John Doe",
    });

    expect(janeLink).toBeInTheDocument();

    expect(janeLink).toHaveAttribute(
      "href",
      "/profile",
    );

    expect(johnLink).toBeInTheDocument();

    expect(johnLink).toHaveAttribute(
      "href",
      "/profile",
    );
  });

  it("volunteer name links have correct styling class", async () => {
    render(<HelpingVolunteers />);

    await screen.findByText("Jane Cooper");

    const janeLink = screen.getByRole("link", {
      name: "Jane Cooper",
    });

    expect(janeLink).toHaveClass(
      "text-blue-600",
    );
  });
});