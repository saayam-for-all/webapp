import { render } from "@testing-library/react";
import HowWeOperate from "./HowWeOperate";

// TODO: mock translate

describe("HowWeOperate", () => {
  it("renders correctly", () => {
    const tree = render(<HowWeOperate />);
    expect(tree).toMatchSnapshot();
  });
});
