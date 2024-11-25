import React from 'react'
import '@testing-library/jest-dom'
import Home from '../../src/pages/LandingPage/LandingPage'
import {render,screen} from '@testing-library/react'
import { MemoryRouter } from 'react-router'

test('Landing page render', () =>{
    render(
        <MemoryRouter>
    <Home/>
    </MemoryRouter>)
})

test('dynamic ing imports all images', () =>{
        render(
            <MemoryRouter>
                <Home/>
            </MemoryRouter>
        )
})