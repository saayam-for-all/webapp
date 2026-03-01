import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import Modal from "./Modal";

const children = <div>child</div>;
const onClose = jest.fn();
const onSubmit = jest.fn();

describe("Modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders when show = true", () => {
    render(
      <Modal show={true} onClose={onClose}>
        {children}
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toMatchSnapshot();
  });

  it("does not render when show = false", () => {
    const { container } = render(
      <Modal show={false} onClose={onClose}>
        {children}
      </Modal>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders submit button when onSubmit is passed", () => {
    render(
      <Modal show={true} onClose={onClose} onSubmit={onSubmit}>
        {children}
      </Modal>,
    );
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("does not render submit button when onSubmit is not passed", () => {
    render(
      <Modal show={true} onClose={onClose}>
        {children}
      </Modal>,
    );
    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <Modal show={true} onClose={onClose}>
        {children}
      </Modal>,
    );
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onSubmit when submit button is clicked", () => {
    render(
      <Modal show={true} onClose={onClose} onSubmit={onSubmit}>
        {children}
      </Modal>,
    );
    fireEvent.click(screen.getByText("Submit"));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("renders custom submit text if provided", () => {
    render(
      <Modal
        show={true}
        onClose={onClose}
        onSubmit={onSubmit}
        submitText="Confirm"
      >
        {children}
      </Modal>,
    );
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });
});
