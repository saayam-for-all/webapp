import { render } from "@testing-library/react";
import Vision from "./Vision";

describe("Vision", () => {
  it("renders correctly", () => {
    const tree = render(<Vision />);
    expect(tree).toMatchSnapshot();
  });
});
