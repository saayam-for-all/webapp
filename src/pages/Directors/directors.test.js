import { render, screen } from "@testing-library/react";
import Directors from "./Directors";

describe("Directors", () => {
  it("renders correctly", () => {
    const tree = render(<Directors />);
    expect(tree).toMatchSnapshot();
  });

  it("shows the current executive team members", () => {
    render(<Directors />);

    expect(screen.getByAltText("Rashmi Bilaskar")).toBeTruthy();
    expect(screen.getByAltText("Sugandha Agrawal")).toBeTruthy();
  });

  it("does not show removed executive profiles", () => {
    render(<Directors />);

    // Removed per #1706: Tejaswi (commit 8794fbc82) and Aakash (PR #1651)
    expect(screen.queryByAltText("Tejaswi Vadapalli")).toBeNull();
    expect(screen.queryByAltText("Aakash Gangji")).toBeNull();
  });
});
