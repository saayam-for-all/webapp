import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { renderWithProviders } from "#utils/test-utils";
import Donate from "./Donate";

// Mock the translation function
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => `mockTranslate(${key})`,
    i18n: {
      language: "en",
    },
  }),
}));

describe("Donate", () => {
  it("renders correctly", () => {
    const { container } = renderWithProviders(<Donate />);
    expect(container).toMatchSnapshot();
  });

  it("renders the main container with correct structure", () => {
    renderWithProviders(<Donate />);

    // Check for main container and grid
    const container = screen.getByTestId("donate-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("donate-container");

    const grid = screen.getByTestId("donate-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("donate-grid");
  });

  it("renders the image section", () => {
    renderWithProviders(<Donate />);

    const imageContainer = screen.getByTestId("donate-image-container");
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass("donate-image-container");

    const image = screen.getByAltText("People helping each other");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("donate-image");
  });

  it("renders the content section", () => {
    renderWithProviders(<Donate />);

    const content = screen.getByTestId("donate-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("donate-content");

    // Check for title and subtitle
    expect(
      screen.getByText("mockTranslate(MAKE_DONATION)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("mockTranslate(DONATION_SUBTITLE)"),
    ).toBeInTheDocument();
  });

  it("renders the achievements section", () => {
    renderWithProviders(<Donate />);

    const achievements = screen.getByTestId("donate-achievements");
    expect(achievements).toBeInTheDocument();
    expect(achievements).toHaveClass("donate-achievements");

    // Check for achievement items
    expect(
      screen.getByText("mockTranslate(DONATION_ACHIEVEMENT_1)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("mockTranslate(DONATION_ACHIEVEMENT_2)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("mockTranslate(DONATION_ACHIEVEMENT_3)"),
    ).toBeInTheDocument();
  });

  it("renders the donation button and QR section", () => {
    renderWithProviders(<Donate />);

    // Check for donation button
    const donateButton = screen.getByText("mockTranslate(DONATE_VIA_PAYPAL)");
    expect(donateButton).toBeInTheDocument();
    expect(donateButton).toHaveClass("donate-button");

    // Check for QR section
    const qrSection = screen.getByTestId("qr-section");
    expect(qrSection).toBeInTheDocument();
    expect(qrSection).toHaveClass("qr-section");

    expect(screen.getByText("mockTranslate(SCAN_QR_CODE)")).toBeInTheDocument();
    expect(
      screen.getByText("mockTranslate(QR_CODE_DESCRIPTION)"),
    ).toBeInTheDocument();
  });

  it("renders the FAQ section", () => {
    renderWithProviders(<Donate />);

    const faqSection = screen.getByTestId("faq-section");
    expect(faqSection).toBeInTheDocument();
    expect(faqSection).toHaveClass("faq-section");

    // Check for FAQ title and questions
    expect(screen.getByText("mockTranslate(FAQ_TITLE)")).toBeInTheDocument();
    expect(
      screen.getByText("mockTranslate(FAQ_TAX_QUESTION)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("mockTranslate(FAQ_USE_QUESTION)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("mockTranslate(FAQ_CANCEL_QUESTION)"),
    ).toBeInTheDocument();
  });
});
