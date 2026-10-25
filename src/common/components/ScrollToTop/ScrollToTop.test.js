import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ScrollToTop from "./ScrollToTop";

// JSDOM has no visibility observer; page scrolling must work independently of it.
window.IntersectionObserver = class {
  observe() {}
  disconnect() {}
};

describe("ScrollToTop", () => {
  const scrollTo = (top) => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: top,
    });
    fireEvent.scroll(window);
  };

  beforeEach(() => {
    scrollTo(0);
    window.matchMedia = jest.fn(() => ({ matches: false }));
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    scrollTo(0);
  });

  it("hides at the page top and appears after scrolling down", () => {
    render(<ScrollToTop />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    scrollTo(600);
    expect(
      screen.getByRole("button", { name: "Scroll to top" }),
    ).toBeInTheDocument();
    scrollTo(0);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows when mounting on an already scrolled page", () => {
    scrollTo(600);
    render(<ScrollToTop />);
    expect(
      screen.getByRole("button", { name: "Scroll to top" }),
    ).toBeInTheDocument();
  });

  it("scrolls the document to the top on click", () => {
    render(<ScrollToTop />);
    scrollTo(600);
    fireEvent.click(screen.getByRole("button", { name: "Scroll to top" }));
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("returns to the top without animation when reduced motion is preferred", () => {
    window.matchMedia.mockReturnValue({ matches: true });
    render(<ScrollToTop />);
    scrollTo(600);
    fireEvent.click(screen.getByRole("button", { name: "Scroll to top" }));
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "instant",
    });
  });
});
