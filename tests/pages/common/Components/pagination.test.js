import Pagination from "../../../../src/common/components/Pagination/Pagination";
import '@testing-library/jest-dom'
import {screen,render} from '@testing-library/react'
import React from 'react'


test('render divs and check classes',() =>{
    render(<Pagination/>)

    const firstDiv = screen.getByTestId('divOne')
    const secondDiv = screen.getByTestId('divTwo')
    const thirdDiv = screen.getByTestId('divThree')
    const fourthDiv = screen.getByTestId('divFour')
    const fifthDiv = screen.getByTestId('divFive')

    expect(firstDiv).toHaveClass("mt-4")
    expect(secondDiv).toHaveClass("flex flex-col items-center")
    expect(thirdDiv).toHaveClass("flex items-center justify-center mb-2")
    expect(fourthDiv).toHaveClass("flex items-center ml-2")
    expect(fifthDiv).toHaveClass("flex items-center space-x-1")
})

test('renders buttons and check classes',() =>{
    
    render(<Pagination/>)
    const firstButton = screen.getByTestId('buttonOne')
    const secondButton = screen.getByTestId('buttonTwo')
    expect(firstButton).toHaveClass("bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-700")
    expect(secondButton).toHaveClass("bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-700")
})

test('renders select and label and check classes',() =>{
    render(<Pagination/>)

    const firstSelect = screen.getByTestId('selectOne')
    const firstLabel = screen.getByTestId('labelOne')
    expect(firstSelect).toHaveClass("border rounded px-2 py-1")
    expect(firstLabel).toHaveClass("mr-2")
})