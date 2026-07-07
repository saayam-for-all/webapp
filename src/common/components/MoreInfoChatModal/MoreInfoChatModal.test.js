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
  requestId: "REQ-00-000-000-0085",
  requesterId: "SID-REQUESTER-001",
  userId: "SID-00-000-000-050",
  subject: "Pick up dry cleaning",
  description: "Need someone to pick up my dry cleaning.",
};

const mockOnClose = jest.fn();

const PLACEHOLDER = "Ask a follow-up question… (max 250 characters)";

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

  it("renders a textarea for input", () => {
    renderModal();
    const textarea = screen.getByPlaceholderText(PLACEHOLDER);
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("maxLength", "250");
    expect(textarea).toHaveAttribute("rows", "3");
  });

  it("updates input text on change", () => {
    renderModal();
    const input = screen.getByPlaceholderText(PLACEHOLDER);
    fireEvent.change(input, { target: { value: "What documents?" } });
    expect(input.value).toBe("What documents?");
  });

  it("enforces 250 character limit", () => {
    renderModal();
    const input = screen.getByPlaceholderText(PLACEHOLDER);
    const longText = "a".repeat(300);
    fireEvent.change(input, { target: { value: longText } });
    // onChange guard rejects values over 250
    expect(input.value).toBe("");
  });

  it("sends message and decrements counter on Send click", async () => {
    moreInformationChat.mockResolvedValue({
      body: { answer: "You need an ID." },
    });

    renderModal();
    const input = screen.getByPlaceholderText(PLACEHOLDER);
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
    const input = screen.getByPlaceholderText(PLACEHOLDER);
    fireEvent.change(input, { target: { value: "Enter test" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(screen.getByText("Reply via enter.")).toBeInTheDocument();
    });
  });

  it("does not send on Shift+Enter", () => {
    renderModal();
    const input = screen.getByPlaceholderText(PLACEHOLDER);
    fireEvent.change(input, { target: { value: "No send" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });

    // Message should stay in textarea, not be sent to the API
    expect(moreInformationChat).not.toHaveBeenCalled();
    expect(input.value).toBe("No send");
  });

  it("does not send empty message", () => {
    renderModal();
    fireEvent.click(screen.getByText("Send"));
    expect(moreInformationChat).not.toHaveBeenCalled();
  });

  it("shows error message when API call fails", async () => {
    moreInformationChat.mockRejectedValue(new Error("Network error"));

    renderModal();
    const input = screen.getByPlaceholderText(PLACEHOLDER);
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

    const key = `moreInfoCooldown_${mockRequestData.requestId}`;
    const stored = JSON.parse(localStorage.getItem(key));
    expect(stored).toHaveProperty("expiresAt");
    expect(stored.expiresAt).toBeGreaterThan(Date.now());
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows Thinking… spinner and disables input while initial response is loading", () => {
    render(
      <MoreInfoChatModal
        show={true}
        onClose={mockOnClose}
        requestData={mockRequestData}
        initialResponse=""
        isInitialLoading={true}
      />,
    );

    expect(screen.getByText("Thinking…")).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText("Loading initial response…");
    expect(textarea).toBeDisabled();
    expect(screen.getByText("Send")).toBeDisabled();
  });

  it("hides spinner and renders assistant message once initialResponse arrives", () => {
    const { rerender } = render(
      <MoreInfoChatModal
        show={true}
        onClose={mockOnClose}
        requestData={mockRequestData}
        initialResponse=""
        isInitialLoading={true}
      />,
    );

    expect(screen.getByText("Thinking…")).toBeInTheDocument();
    expect(screen.queryByText("Here are some resources for you.")).toBeNull();

    rerender(
      <MoreInfoChatModal
        show={true}
        onClose={mockOnClose}
        requestData={mockRequestData}
        initialResponse="Here are some resources for you."
        isInitialLoading={false}
      />,
    );

    expect(screen.queryByText("Thinking…")).toBeNull();
    expect(
      screen.getByText("Here are some resources for you."),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(PLACEHOLDER)).not.toBeDisabled();
  });

  it("calls moreInformationChat with user_id, req_id, and conversation_history", async () => {
    moreInformationChat.mockResolvedValue({
      body: { answer: "Response." },
    });

    renderModal();
    const input = screen.getByPlaceholderText(PLACEHOLDER);
    fireEvent.change(input, { target: { value: "My question" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(moreInformationChat).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockRequestData.requesterId,
          req_id: mockRequestData.requestId,
          conversation_history: expect.arrayContaining([
            expect.objectContaining({ role: "assistant" }),
            expect.objectContaining({ role: "user", content: "My question" }),
          ]),
        }),
      );
    });
  });
});
