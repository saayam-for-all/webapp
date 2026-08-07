import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../../assets/donate_buttons/Benevity_logo.svg", () => "benevity");
jest.mock(
  "../../assets/donate_buttons/CharityNav_Logo_Stack.png",
  () => "charitynav",
);
jest.mock("../../assets/donate_buttons/PayPal.svg", () => "paypal");
jest.mock("../../assets/donate_buttons/Stripe_Logo.png", () => "stripe");
jest.mock("../../assets/donate_img_bg.webp", () => "donate-bg");

import Donate from "./Donate";

describe("Donate", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders correctly", () => {
    const tree = render(
      <MemoryRouter>
        <Donate />
      </MemoryRouter>,
    );
    expect(tree).toMatchSnapshot();
  });

  it("renders the FAQ section", () => {
    render(
      <MemoryRouter>
        <Donate />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("faq-section")).toBeTruthy();
  });

  it("renders the Join Our Community button", () => {
    render(
      <MemoryRouter>
        <Donate />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("button", { name: /join our community/i }),
    ).toBeTruthy();
  });

  it("navigates to login page when Join Our Community button is clicked", () => {
    render(
      <MemoryRouter>
        <Donate />
      </MemoryRouter>,
    );
    const joinButton = screen.getByRole("button", {
      name: /join our community/i,
    });
    fireEvent.click(joinButton);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
