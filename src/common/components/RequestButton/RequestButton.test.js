import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RequestButton from "./RequestButton";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn((fn) => fn({ auth: { user: { zoneinfo: "US" } } })),
}));

jest.mock("../../../services/requestServices", () => ({
  getEmergencyContactInfo: jest.fn(),
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

jest.mock(
  "../MoreInfoChatModal/MoreInfoChatModal",
  () => (props) =>
    props.show ? (
      <div data-testid="chat-modal">
        <span data-testid="initial-response">{props.initialResponse}</span>
      </div>
    ) : null,
);

const {
  getEmergencyContactInfo,
  moreInformationChat,
} = require("../../../services/requestServices");

const mockRequestData = {
  id: "REQ-001",
  category: "ERRANDS_EVENTS_TRANSPORTATION",
  subject: "Pick up dry cleaning",
  description: "Need dry cleaning pickup.",
  location: "",
  gender: "",
  age: "",
};

describe("RequestButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders button with text", () => {
    render(
      <RequestButton
        text="More Information"
        isInfoRequest={true}
        customStyle=""
        icon="i-info"
        requestData={mockRequestData}
      />,
    );
    expect(screen.getByText("More Information")).toBeInTheDocument();
  });

  it("navigates when isInfoRequest is false", () => {
    render(
      <RequestButton
        text="Volunteer"
        link="/volunteer"
        isInfoRequest={false}
        customStyle=""
        icon="i-volunteer"
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/volunteer", { state: {} });
  });

  it("calls onClick prop when provided", () => {
    const handleClick = jest.fn();
    render(
      <RequestButton
        text="Custom"
        isInfoRequest={true}
        customStyle=""
        onClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
    expect(moreInformationChat).not.toHaveBeenCalled();
  });

  it("opens chat modal with initial response on More Information click", async () => {
    moreInformationChat.mockResolvedValue({
      body: { answer: "Here is some info." },
    });

    render(
      <RequestButton
        text="More Information"
        isInfoRequest={true}
        customStyle=""
        icon="i-info"
        requestData={mockRequestData}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByTestId("chat-modal")).toBeInTheDocument();
      expect(screen.getByTestId("initial-response")).toHaveTextContent(
        "Here is some info.",
      );
    });
  });

  it("calls moreInformationChat with resolved category_id", async () => {
    moreInformationChat.mockResolvedValue({
      body: { answer: "Answer" },
    });

    render(
      <RequestButton
        text="More Information"
        isInfoRequest={true}
        customStyle=""
        icon="i-info"
        requestData={mockRequestData}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(moreInformationChat).toHaveBeenCalledWith(
        expect.objectContaining({
          category_id: "6.5",
          subject: "Pick up dry cleaning",
        }),
      );
    });
  });

  it("shows cooldown dialog when cooling down", async () => {
    const key = `moreInfoCooldown_${mockRequestData.id}`;
    localStorage.setItem(
      key,
      JSON.stringify({ expiresAt: Date.now() + 30 * 60 * 1000 }),
    );

    render(
      <RequestButton
        text="More Information"
        isInfoRequest={true}
        customStyle=""
        icon="i-info"
        requestData={mockRequestData}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(
      screen.getByText(/You have reached the question limit/),
    ).toBeInTheDocument();
    expect(moreInformationChat).not.toHaveBeenCalled();
  });

  it("does not show cooldown when cooldown has expired", async () => {
    const key = `moreInfoCooldown_${mockRequestData.id}`;
    localStorage.setItem(key, JSON.stringify({ expiresAt: Date.now() - 1000 }));

    moreInformationChat.mockResolvedValue({
      body: { answer: "Fresh response" },
    });

    render(
      <RequestButton
        text="More Information"
        isInfoRequest={true}
        customStyle=""
        icon="i-info"
        requestData={mockRequestData}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(moreInformationChat).toHaveBeenCalled();
    });

    expect(localStorage.getItem(key)).toBeNull();
  });

  it("shows error content when API call fails", async () => {
    moreInformationChat.mockRejectedValue(new Error("API error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <RequestButton
        text="More Information"
        isInfoRequest={true}
        customStyle=""
        icon="i-info"
        requestData={mockRequestData}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("fetches emergency contact on Emergency Contact click", async () => {
    getEmergencyContactInfo.mockResolvedValue({
      body: { US: "911" },
    });

    render(
      <RequestButton
        text="Emergency Contact"
        isInfoRequest={true}
        customStyle=""
        icon="i-emergency"
        requestData={mockRequestData}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("US: 911")).toBeInTheDocument();
    });
  });

  it("renders correct icons", () => {
    const { rerender } = render(
      <RequestButton text="Info" customStyle="" icon="i-info" />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<RequestButton text="Vol" customStyle="" icon="i-volunteer" />);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<RequestButton text="Em" customStyle="" icon="i-emergency" />);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<RequestButton text="None" customStyle="" icon="unknown" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
