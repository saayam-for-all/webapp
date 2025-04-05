import { render } from "@testing-library/react";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  it("renders correctly", () => {
    const tree = render(<HeroSection />);
    expect(tree).toMatchSnapshot();
  });
});
