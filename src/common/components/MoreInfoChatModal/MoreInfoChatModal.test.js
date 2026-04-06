import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import MoreInfoChatModal from "./MoreInfoChatModal";

jest.mock("../../../services/requestServices", () => ({
  moreInformationChat: jest.fn(),
}));

jest.mock("../../../utils/filterHelpers", () => ({
  getCategoriesFromStorage: jest.fn(() => [
    {
      catId: "6",
      catName: "ELDERLY_COMMUNITY_ASSISTANCE",
      subCategories: [
        { catId: "6.5", catName: "ERRANDS_EVENTS_TRANSPORTATION" },
      ],
    },
  ]),
}));

jest.mock("../../i18n/i18n", () => ({
  language: "en",
}));

jest.mock("react-markdown", () => (props) => (
  <div data-testid="markdown">{props.children}</div>
));

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

const { moreInformationChat } = require("../../../services/requestServices");

const mockRequestData = {
  id: "REQ-001",
  category: "ERRANDS_EVENTS_TRANSPORTATION",
  subject: "Pick up dry cleaning",
  description: "Need someone to pick up my dry cleaning.",
  location: "San Francisco, CA",
  gender: "Female",
  age: "35",
};

const mockOnClose = jest.fn();

const renderModal = (props = {}) =>
  render(
    <MoreInfoChatModal
      show={true}
      onClose={mockOnClose}
      requestData={mockRequestData}
      initialResponse="Here are some resources for you."
      {...props}
    />,
  );

describe("MoreInfoChatModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("does not render when show is false", () => {
    const { container } = render(
      <MoreInfoChatModal
        show={false}
        onClose={mockOnClose}
        requestData={mockRequestData}
        initialResponse="Hello"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders with initial response as first AI message", () => {
    renderModal();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText("Here are some resources for you."),
    ).toBeInTheDocument();
    expect(screen.getByText("More Information")).toBeInTheDocument();
  });

  it("shows counter badge with initial value of 5", () => {
    renderModal();
    expect(screen.getByTitle("5 questions remaining")).toHaveTextContent("5");
  });

  it("updates input text on change", () => {
    renderModal();
    const input = screen.getByPlaceholderText("Ask a follow-up question…");
    fireEvent.change(input, { target: { value: "What documents?" } });
    expect(input.value).toBe("What documents?");
  });

  it("sends message and decrements counter on Send click", async () => {
    moreInformationChat.mockResolvedValue({
      body: { answer: "You need an ID." },
    });

    renderModal();
    const input = screen.getByPlaceholderText("Ask a follow-up question…");
    fireEvent.change(input, { target: { value: "What documents do I need?" } });
    fireEvent.click(screen.getByText("Send"));

    expect(screen.getByText("What documents do I need?")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("You need an ID.")).toBeInTheDocument();
    });

    expect(screen.getByTitle("4 questions remaining")).toHaveTextContent("4");
  });

  it("sends message on Enter key", async () => {
    moreInformationChat.mockResolvedValue({
      body: { answer: "Reply via enter." },
    });

    renderModal();
    const input = screen.getByPlaceholderText("Ask a follow-up question…");
    fireEvent.change(input, { target: { value: "Enter test" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(screen.getByText("Reply via enter.")).toBeInTheDocument();
    });
  });

  it("does not send on Shift+Enter", () => {
    renderModal();
    const input = screen.getByPlaceholderText("Ask a follow-up question…");
    fireEvent.change(input, { target: { value: "No send" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });

    expect(screen.queryByText("No send")).not.toBeInTheDocument();
  });

  it("does not send empty message", () => {
    renderModal();
    fireEvent.click(screen.getByText("Send"));
    expect(moreInformationChat).not.toHaveBeenCalled();
  });

  it("shows error message when API call fails", async () => {
    moreInformationChat.mockRejectedValue(new Error("Network error"));

    renderModal();
    const input = screen.getByPlaceholderText("Ask a follow-up question…");
    fireEvent.change(input, { target: { value: "Will this fail?" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred while fetching the response."),
      ).toBeInTheDocument();
    });
  });

  it("disables input and shows message after 5 questions", async () => {
    moreInformationChat.mockResolvedValue({
      body: { answer: "Answer." },
    });

    renderModal();

    for (let i = 0; i < 5; i++) {
      const input = screen.getByPlaceholderText(/question/i);
      fireEvent.change(input, { target: { value: `Question ${i + 1}` } });

      await act(async () => {
        fireEvent.click(screen.getByText("Send"));
      });

      await waitFor(() => {
        expect(screen.getAllByText("Answer.").length).toBe(i + 1);
      });
    }

    expect(screen.getByTitle("0 questions remaining")).toHaveTextContent("0");
    expect(
      screen.getByPlaceholderText("No questions remaining"),
    ).toBeDisabled();
    expect(screen.getByText("No questions remaining.")).toBeInTheDocument();
  });

  it("stores cooldown in localStorage and calls onClose when close button clicked", () => {
    renderModal();
    fireEvent.click(screen.getByLabelText("Close"));

    const key = `moreInfoCooldown_${mockRequestData.id}`;
    const stored = JSON.parse(localStorage.getItem(key));
    expect(stored).toHaveProperty("expiresAt");
    expect(stored.expiresAt).toBeGreaterThan(Date.now());
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls moreInformationChat with correct payload shape", async () => {
    moreInformationChat.mockResolvedValue({
      body: { answer: "Response." },
    });

    renderModal();
    const input = screen.getByPlaceholderText("Ask a follow-up question…");
    fireEvent.change(input, { target: { value: "My question" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(moreInformationChat).toHaveBeenCalledWith(
        expect.objectContaining({
          category_id: "6.5",
          subject: "Pick up dry cleaning",
          description: "My question",
          conversation_history: expect.arrayContaining([
            expect.objectContaining({ role: "assistant" }),
            expect.objectContaining({ role: "user" }),
          ]),
        }),
      );
    });
  });
});
