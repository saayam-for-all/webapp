import { render } from "@testing-library/react";
import HowWeOperate from "./HowWeOperate";

describe("HowWeOperate", () => {
  it("renders correctly", () => {
    const tree = render(<HowWeOperate />);
    expect(tree).toMatchSnapshot();
  });
});
