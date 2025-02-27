import { render } from "@testing-library/react";
import MissionVision from "./MissionVision";

describe("MissionVision", () => {
  it("renders correctly", () => {
    const tree = render(<MissionVision />);
    expect(tree).toMatchSnapshot();
  });
});
