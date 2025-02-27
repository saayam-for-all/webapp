import { render } from "@testing-library/react";
import Mission from "./Mission";

//TODO: mock translation

describe("Mission", () => {
  it("renders correctly", () => {
    const tree = render(<Mission />);
    expect(tree).toMatchSnapshot();
  });
});
