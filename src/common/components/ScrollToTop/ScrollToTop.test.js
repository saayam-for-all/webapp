//Mock IntersectionObserver for Jest environment which is supported by React
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {
      this.callback([{ isIntersecting: false }]);
    }
    unobserve() {}
    disconnect() {}
  };
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ScrollToTop from "./ScrollToTop";

describe("ScrollToTop", () => {
  beforeEach(() => {
    //dummy header element
    const header = document.createElement("div");
    header.setAttribute("id", "header");
    document.body.appendChild(header);
  });

  afterEach(() => {
    const header = document.getElementById("header");
    if (header) header.remove();
  });

  //test case 1
  it("renders the scroll button", () => {
    render(<ScrollToTop />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  //test case 2
  it("scrolls to top on click", () => {
    const scrollSpy = jest.spyOn(window, "scrollTo");
    render(<ScrollToTop />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(scrollSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
