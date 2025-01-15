import React from 'react'

import YourProfile from '../../../src/pages/Profile/YourProfile'

import {screen,render} from '@testing-library/react'

import fetchMock from 'fetch-mock-jest'

beforeEach(() => {
    fetchMock.mock('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json', 
    [{
      name: 'Country1',
      iso3: 'C1',
      iso2: 'C1',
      phone_code: '123'
    }, 
    {
      name: 'Country2',
      iso3: 'C2',
      iso2: 'C2',
      phone_code: '456'
    }]);
  });
  
  // Limpiar mocks después de cada test
  afterEach(() => {
    fetchMock.restore();
  });

test('Check containers class', () => {

    render(<YourProfile/>)

    const containerOne = screen.getByTestId('container-test-1')
    const containerTwo = screen.getByTestId('container-test-2')
    const containerThree = screen.getByTestId('container-test-3')
    const containerFour = screen.getByTestId('container-test-4')
    const containerFive = screen.getByTestId('container-test-5')
    const containerSix = screen.getByTestId('container-test-6')
    const containerSeven = screen.getByTestId('container-test-7')

    expect(containerOne).toHaveClass("flex flex-col border p-6 rounded-lg w-full")
    expect(containerTwo).toHaveClass('')
    expect(containerThree).toHaveClass('')
    expect(containerFour).toHaveClass('')
    expect(containerFive).toHaveClass('')
    expect(containerSix).toHaveClass('')
    expect(containerSeven).toHaveClass('')


})