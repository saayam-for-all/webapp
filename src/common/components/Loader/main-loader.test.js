import { render } from "@testing-library/react";
import MainLoader from "./MainLoader";

describe("MainLoader", () => {
  it("renders correctly", () => {
    const tree = render(<MainLoader />);
    expect(tree).toMatchSnapshot();
  });
});
