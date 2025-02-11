import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("contains copyright info", () => {
    render(<Footer />);
    const copyrightMessage = "Copyright © 2024 Saayam. All Rights Reserved";
    expect(screen.getByText(copyrightMessage)).toBeInTheDocument();
  });

  it("renders correctly", () => {
    const tree = render(<Footer />);
    expect(tree).toMatchSnapshot();
  });
});
