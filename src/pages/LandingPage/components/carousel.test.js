import { render } from "@testing-library/react";
import Carousel from "./Carousel";

describe("Carousel", () => {
  it("renders correctly", () => {
    const tree = render(<Carousel />);
    expect(tree).toMatchSnapshot();
  });
});
