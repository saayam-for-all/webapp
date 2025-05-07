import { render } from "@testing-library/react";
import MainLoader from "./MainLoader";
import { axe,toHaveNoViolations } from "jest-axe";

describe("MainLoader", () => {
  expect.extend(toHaveNoViolations)
  it("renders correctly", () => {
    const tree = render(<MainLoader />);
    expect(tree).toMatchSnapshot();
  });
  it('accesibility test', async() =>{
    const {container} = render(<MainLoader/>)
    expect(await axe(container)).toHaveNoViolations()
  })
});
