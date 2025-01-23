import React from "react";
import {MemoryRouter} from 'react-router'
import {Provider} from "react-redux"
import {createStore} from "redux";
import '@testing-library/jest-dom'
import {render, screen, fireEvent,} from '@testing-library/react'
import RequestDetails from '../../../src/pages/RequestDetails/RequestDetails'

test('renders request details', () => {
  /*
  const store = createStore((state = {
                               auth: {
                                 idToken: 'mockIdToken',
                               }
                             }
  ) => state);

  render(
    <MemoryRouter>
      <Provider store={store}>
        <RequestDetails/>
      </Provider>
    </MemoryRouter>
  )

  const handleToggleContainer = screen.getByTestId('handleToggleContainer');
  fireEvent.click(handleToggleContainer);

  const requestDescriptionComponent = screen.getByText(
    /We need volunteers for our upcoming Community Clean-Up Day on/i
  );
  expect(requestDescriptionComponent).toBeInTheDocument()
  */
})
