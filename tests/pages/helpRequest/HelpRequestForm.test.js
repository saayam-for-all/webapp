import '@testing-library/jest-dom'
import React from 'react'
import HelpRequestForm from '../../../src/pages/HelpRequest/HelpRequestForm'
import {render,screen} from '@testing-library/react'

test('it renders and checks divs with mt-3 class, the parent divs', () => {
    render(<HelpRequestForm/>)

    const firstParentDiv = screen.getByTestId('parentDivSeven')
    const secondParentDiv = screen.getByTestId('parentDivTwo')
    const thirdParentDiv = screen.getByTestId('parentDivThree')
    const fourthParentDiv = screen.getByTestId('parentDivFour')
    const fifthParentDiv = screen.getByTestId('parentDivFive')
    const sixthParentDiv = screen.getByTestId('parentDivSix')
    const seventhDiv = screen.getByTestId('parentDivSeven')

    const divs = [firstParentDiv,secondParentDiv,thirdParentDiv,fourthParentDiv,fifthParentDiv,sixthParentDiv,seventhDiv]

    divs.forEach((div) =>{
        expect(div).toHaveClass('mt-3')
    })
})