import { render } from "@testing-library/react";
import LandingPage from "./LandingPage";

jest.mock("./components/HeroSection");
jest.mock("./components/Info");
jest.mock("./components/Dynamic_img");

describe("LandingPage", () => {
  it("renders correctly", () => {
    const tree = render(<LandingPage />);
    expect(tree).toMatchSnapshot();
  });
});
