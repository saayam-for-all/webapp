import React from 'react'
import '@testing-library/jest-dom'
import {screen,render} from '@testing-library/react'
import Pagination from "../../../../src/common/components/Pagination/Pagination";

test('render divs and check classes',() =>{
    render(
      <Pagination
        currentPage={1}
        totalPages={20}
        onPageChange={() => null}
        rowsPerPage={3}
        onRowsPerPageChange={() => null}
      />
    )

    const firstDiv = screen.getByTestId('divOne')
    const secondDiv = screen.getByTestId('divTwo')
    const thirdDiv = screen.getByTestId('divThree')
    const fourthDiv = screen.getByTestId('divFour')

    expect(firstDiv).toHaveClass("mt-20 p-5")
    expect(secondDiv).toHaveClass("flex justify-between items-center")
    expect(thirdDiv).toHaveClass("flex items-center justify-center mb-2")
    expect(fourthDiv).toHaveClass("flex items-center space-x-2")
})

test('renders buttons and check classes',() =>{
    render(
      <Pagination
        currentPage={1}
        totalPages={20}
        onPageChange={() => null}
        rowsPerPage={3}
        onRowsPerPageChange={() => null}
      />
    )

    const firstButton = screen.getByTestId('buttonOne')
    const secondButton = screen.getByTestId('buttonTwo')

    expect(firstButton).toHaveClass("bg-gray-200 text-black py-2 px-2 rounded hover:bg-gray-500")
    expect(secondButton).toHaveClass("bg-gray-200 text-black py-2 px-2 rounded hover:bg-gray-500")
})

test('renders label and check classes',() =>{
    render(
      <Pagination
        currentPage={1}
        totalPages={20}
        onPageChange={() => null}
        rowsPerPage={3}
        onRowsPerPageChange={() => null}
      />
    )

    const firstLabel = screen.getByTestId('labelOne')

    expect(firstLabel).toHaveClass("mr-2 text-gray-400")
})
