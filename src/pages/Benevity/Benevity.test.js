import { render } from "@testing-library/react";
import BenevityInfo from "./BenevityInfo";

describe("BenevityInfo", () => {
  it("renders correctly", () => {
    const tree = render(<BenevityInfo />);
    expect(tree).toMatchSnapshot();
  });
});
