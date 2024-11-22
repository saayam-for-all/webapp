import React from 'react'
import '@testing-library/jest-dom'
import {render,screen} from '@testing-library/react'
import RequestDetails from '../../../src/pages/RequestDetails/RequestDetails'
//import RequestDescription from '../src/pages/RequestDetails/RequestDescription'
//import RequestDetailsSidebar from '../src/pages/RequestDetails/RequestDetailsSidebar'
import { MemoryRouter } from 'react-router'
test('renders request details', () =>{
    render(
        <MemoryRouter>
    <RequestDetails/>
    </MemoryRouter>)

    const requestDescriptionComponent = screen.getByText(
        /We need volunteers for our upcoming Community Clean-Up Day/i
      );
    expect(requestDescriptionComponent).toBeInTheDocument()

})