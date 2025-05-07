import { render } from "@testing-library/react";
import RightAds from "./RightAds";
import { toHaveNoViolations, axe } from "jest-axe";

describe("RightAdds", () => {
  expect.extend(toHaveNoViolations)
  it("renders correctly", () => {
    const tree = render(<RightAds />);
    expect(tree).toMatchSnapshot();
  });
  it('accesibility test', async () =>{
    const {container} = render(<RightAds/>)
    expect(await axe(container)).toHaveNoViolations()
  })
});
