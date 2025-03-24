import React from "react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import HelpRequestForm from "../../../src/pages/HelpRequest/HelpRequestForm";

test("it renders and checks divs with mt-3 class, the parent divs", () => {
  /*
  const store = createStore((state = {
                                 auth: {
                                   idToken: 'mockIdToken',
                                 },
                                 request: {
                                   categories: 'categories',
                                 }
                               }
    ) => state);

    global.fetch = jest.fn(() => Promise.reject(null));

    render(
      <MemoryRouter>
        <Provider store={store}>
          <HelpRequestForm/>
        </Provider>
      </MemoryRouter>
    )

    const dropdown = screen.getByTestId('dropdown');
    fireEvent.change(dropdown, {target: {value: 'no'}});

    const firstParentDiv = screen.getByTestId('parentDivOne')
    const secondParentDiv = screen.getByTestId('parentDivTwo')
    const thirdParentDiv = screen.getByTestId('parentDivThree')
    const fourthParentDiv = screen.getByTestId('parentDivFour')
    const fifthParentDiv = screen.getByTestId('parentDivFive')
    const sixthParentDiv = screen.getByTestId('parentDivSix')
    const seventhDiv = screen.getByTestId('parentDivSeven')

    const divs = [firstParentDiv, secondParentDiv, thirdParentDiv, fourthParentDiv, fifthParentDiv, sixthParentDiv, seventhDiv]

    divs.forEach((div) => {
      expect(div).toHaveClass('mt-3')
    })
    */
});
