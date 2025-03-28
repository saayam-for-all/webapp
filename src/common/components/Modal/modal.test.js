import "@testing-library/jest-dom";

import { render } from "@testing-library/react";

import Modal from "./Modal";

const children = <div>child</div>;
const onClose = jest.fn();

describe("Modal", () => {
  it("renders when show = true", () => {
    const tree = render(
      <Modal show={true} onClose={onClose}>
        {children}
      </Modal>,
    );
    expect(tree).toMatchSnapshot();
  });

  it("does not render when show = false", () => {
    const tree = render(
      <Modal show={false} onClose={onClose}>
        {children}
      </Modal>,
    );
    expect(tree.container).toBeEmptyDOMElement();
  });
});
