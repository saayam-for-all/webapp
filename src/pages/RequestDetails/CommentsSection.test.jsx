import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import CommentsSection from "./CommentsSection";
import i18n from "../../common/i18n/i18n";

const renderWithI18n = (component) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe("CommentsSection", () => {
  const mockComments = [
    {
      id: 1,
      name: "John Doe",
      message: "Test comment message",
      date: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Another test comment",
      date: "2024-01-14T09:00:00Z",
    },
    {
      id: 3,
      name: "Bob Wilson",
      message: "Third comment here",
      date: "2024-01-16T11:00:00Z",
    },
  ];

  it("renders without crashing", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("displays NO_COMMENTS_FOUND when comments array is empty", () => {
    renderWithI18n(<CommentsSection comments={[]} />);
    expect(screen.getByText("NO_COMMENTS_FOUND")).toBeInTheDocument();
  });

  it("displays NO_COMMENTS_FOUND when search returns no results", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    expect(screen.getByText("NO_COMMENTS_FOUND")).toBeInTheDocument();
  });

  it("filters comments based on search text (name)", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "John" } });

    expect(screen.getByText("Test comment message")).toBeInTheDocument();
    expect(screen.queryByText("Another test comment")).not.toBeInTheDocument();
  });

  it("filters comments based on search text (message content)", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "Third" } });

    expect(screen.getByText("Third comment here")).toBeInTheDocument();
    expect(screen.queryByText("Test comment message")).not.toBeInTheDocument();
  });

  it("clears search when cancel button is clicked", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "test" } });

    const cancelButton = screen.getByLabelText(/clear/i);
    fireEvent.click(cancelButton);

    expect(searchInput.value).toBe("");
  });

  it("sorts comments by newest by default", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);
    const sortButton = screen.getByText(/SORT_BY/i);
    expect(sortButton).toBeInTheDocument();
  });

  it("toggles sort order when sort button is clicked", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);

    const sortButton = screen.getByText(/SORT_BY/i);
    fireEvent.click(sortButton);

    expect(screen.getByText(/OLDEST/i)).toBeInTheDocument();
  });

  it("resets to page 1 when search text changes", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "John" } });

    expect(screen.getByText(/Showing.*1.*to/i)).toBeInTheDocument();
  });

  it("displays pagination when there are multiple pages", () => {
    const manyComments = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      message: `Message ${i}`,
      date: "2024-01-15T10:00:00Z",
    }));

    renderWithI18n(<CommentsSection comments={manyComments} />);

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
  });

  it("handles comment submission", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);

    const textarea = screen.getByPlaceholderText(/writeComment/i);
    fireEvent.change(textarea, { target: { value: "New comment" } });

    // The send button is the blue circular button next to textarea
    const submitButton = screen
      .getAllByRole("button")
      .find((btn) => btn.className?.includes("bg-blue-500"));
    expect(submitButton).toBeTruthy();
    fireEvent.click(submitButton);

    expect(textarea.value).toBe("");
  });

  it("shows character count for comment input", () => {
    renderWithI18n(<CommentsSection comments={mockComments} />);

    const textarea = screen.getByPlaceholderText(/writeComment/i);
    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(screen.getByText("5/200")).toBeInTheDocument();
  });

  it("handles rows per page change", () => {
    const manyComments = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      message: `Message ${i}`,
      date: "2024-01-15T10:00:00Z",
    }));

    renderWithI18n(<CommentsSection comments={manyComments} />);

    const select = screen.getByLabelText(/Rows per view/i);
    fireEvent.change(select, { target: { value: "10" } });

    expect(screen.getByText(/Showing.*1.*to.*10/i)).toBeInTheDocument();
  });
});
