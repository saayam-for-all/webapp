import React from 'react'
import {MemoryRouter} from 'react-router'
import {Provider} from "react-redux"
import {createStore} from "redux";
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import Home from '../../src/pages/LandingPage/LandingPage'

test('Landing page render', () => {
  const store = createStore((state = {
                               auth: {
                                 user: {
                                   sub: 'mockSub'
                                 }
                               }
                             }
  ) => state);

  render(
    <MemoryRouter>
      <Provider store={store}>
        <Home/>
      </Provider>
    </MemoryRouter>
  )
})

test('dynamic ing imports all images', () => {
  const store = createStore((state = {
                               auth: {
                                 user: {
                                   sub: 'mockSub'
                                 }
                               }
                             }
  ) => state);

  render(
    <MemoryRouter>
      <Provider store={store}>
        <Home/>
      </Provider>
    </MemoryRouter>
  )
})
