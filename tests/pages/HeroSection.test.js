import React from 'react'
import HeroSection from '../../src/pages/LandingPage/components/HeroSection'
import '@testing-library/jest-dom'
import {render,screen} from '@testing-library/react'
import { MemoryRouter } from 'react-router'

test('renders hero section', () =>{

    render(
    <MemoryRouter>
        <HeroSection/>
    </MemoryRouter>)


})