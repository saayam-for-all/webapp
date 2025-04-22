import { render } from "@testing-library/react";
import Mission from "./Mission";

describe("Mission", () => {
  it("renders correctly", () => {
    const tree = render(<Mission />);
    expect(tree).toMatchSnapshot();
  });
});
