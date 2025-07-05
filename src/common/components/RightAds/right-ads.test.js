import { render } from "@testing-library/react";
import RightAds from "./RightAds";

describe("RightAdds", () => {
  it("renders correctly", () => {
    const tree = render(<RightAds />);
    expect(tree).toMatchSnapshot();
  });
});
