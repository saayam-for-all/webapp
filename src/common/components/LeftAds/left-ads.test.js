import { render } from "@testing-library/react";
import LeftAds from "./LeftAds";
import { axe,toHaveNoViolations } from "jest-axe";

describe("LeftAds", () => {
  expect.extend(toHaveNoViolations)
  it("renders correctly", () => {
    const tree = render(<LeftAds />);
    expect(tree).toMatchSnapshot();
  });
  test('accesibility test', async () =>{
    const {container} = render(<LeftAds/>)

    expect( await axe(container)).toHaveNoViolations()
  })
});
