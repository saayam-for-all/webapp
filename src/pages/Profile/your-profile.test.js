import { render } from "@testing-library/react";
import YourProfile from "./YourProfile";

// TODO: mock CallModal after adding tests for CallModal

describe("YourProfile", () => {
  it("renders correctly", () => {
    const tree = render(<YourProfile />);
    expect(tree).toMatchSnapshot();
  });
});
