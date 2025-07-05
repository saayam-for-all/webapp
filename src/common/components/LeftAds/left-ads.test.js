import { render } from "@testing-library/react";
import LeftAds from "./LeftAds";

describe("LeftAds", () => {
  it("renders correctly", () => {
    const tree = render(<LeftAds />);
    expect(tree).toMatchSnapshot();
  });
});
