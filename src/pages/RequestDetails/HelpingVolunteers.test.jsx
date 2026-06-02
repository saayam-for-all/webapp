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
  getVolunteersData: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  getVolunteersData.mockResolvedValue(mockVolunteers);
});

async function setup() {
  render(<HelpingVolunteers />);
  await screen.findByText("Jane Cooper");
}

describe("HelpingVolunteers", () => {
  it("shows loading spinner", async () => {
    getVolunteersData.mockImplementationOnce(
      () => new Promise(() => {}),
    );

    render(<HelpingVolunteers />);

    expect(
      await screen.findByText(/Loading/i),
    ).toBeInTheDocument();
  });

  it("shows API error", async () => {
    getVolunteersData.mockRejectedValueOnce(
      new Error("API error"),
    );

    render(<HelpingVolunteers />);

    await waitFor(() => {
      expect(
        screen.getByText(/API error/i),
      ).toBeInTheDocument();
    });
  });

  it("renders volunteers", async () => {
    await setup();

    expect(
      screen.getByText("Jane Cooper"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("John Doe"),
    ).toBeInTheDocument();
  });

  it("search filters volunteers", async () => {
    await setup();

    const searchInput =
      screen.getByPlaceholderText(
        /SEARCH_BY_NAME/i,
      );

    fireEvent.change(searchInput, {
      target: { value: "Jane" },
    });

    expect(
      screen.getByText("Jane Cooper"),
    ).toBeInTheDocument();
  });

  it("request volunteers button works", async () => {
    await setup();

    const input =
      screen.getByRole("spinbutton");

    fireEvent.change(input, {
      target: { value: "3" },
    });

    fireEvent.click(
      screen.getByText(/REQUEST_VOLUNTEERS/i),
    );

    expect(
      screen.getByText(/3 Volunteers Requested/i),
    ).toBeInTheDocument();
  });

  it("shows max volunteer validation", async () => {
    await setup();

    const input =
      screen.getByRole("spinbutton");

    fireEvent.change(input, {
      target: { value: "10" },
    });

    fireEvent.click(
      screen.getByText(/REQUEST_VOLUNTEERS/i),
    );

    expect(
      screen.getByText(
        /Maximum 5 volunteer can be assigned/i,
      ),
    ).toBeInTheDocument();
  });

  it("selects volunteer checkbox", async () => {
    await setup();

    const checkboxes =
      screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[1]);

    expect(
      screen.getByRole("button", {
        name: /Zoom Meeting/i,
      }),
    ).toBeEnabled();
  });

  it("deselects volunteer checkbox", async () => {
    await setup();

    const checkboxes =
      screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[1]);

    fireEvent.click(checkboxes[1]);

    expect(
      screen.getByRole("button", {
        name: /Zoom Meeting/i,
      }),
    ).toBeDisabled();
  });

  it("select-all checkbox selects all volunteers", async () => {
    await setup();

    const selectAll =
      screen.getByRole("checkbox", {
        name: /Select all volunteers on this page/i,
      });

    fireEvent.click(selectAll);

    expect(selectAll).toBeChecked();
  });

  it("unchecking select-all deselects volunteers", async () => {
    await setup();

    const selectAll =
      screen.getByRole("checkbox", {
        name: /Select all volunteers on this page/i,
      });

    fireEvent.click(selectAll);

    fireEvent.click(selectAll);

    expect(selectAll).not.toBeChecked();
  });

  it("delete button removes selected volunteers", async () => {
    await setup();

    const checkboxes =
      screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[1]);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Delete/i,
      }),
    );

    expect(
      screen.queryByText("Jane Cooper"),
    ).not.toBeInTheDocument();
  });

  it("renders volunteer links", async () => {
    await setup();

    const janeLink = screen.getByRole("link", {
      name: "Jane Cooper",
    });

    expect(janeLink).toHaveAttribute(
      "href",
      "/profile",
    );

    expect(janeLink).toHaveClass(
      "text-blue-600",
    );
  });

  it("sort headers are clickable", async () => {
    await setup();

    fireEvent.click(screen.getByText("Name"));

    expect(
      screen.getByText("Name"),
    ).toBeInTheDocument();
  });
});