import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders correctly", () => {
    const tree = render(<Footer />);
    expect(tree).toMatchSnapshot();
  });
});
