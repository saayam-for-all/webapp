import { render } from "@testing-library/react";
import Images from "./Dynamic_img";

describe("Images", () => {
  it("renders correctly", () => {
    const tree = render(<Images />);
    expect(tree).toMatchSnapshot();
  });
});
