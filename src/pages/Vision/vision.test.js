import { render } from "@testing-library/react";
import Vision from "./Vision";

//TODO: mock translation

describe("Vision", () => {
  it("renders correctly", () => {
    const tree = render(<Vision />);
    expect(tree).toMatchSnapshot();
  });
});
