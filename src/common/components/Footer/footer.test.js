import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Footer from "./Footer";
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe("Footer",  () => {

  it("renders correctly", () => {
    const tree = render(<Footer />);
    expect(tree).toMatchSnapshot();
  });
  it('does accesibility tests',async () =>{
    const {container} = render(<Footer/>)
    expect(await axe(container)).toHaveNoViolations
  })
});
