import React from 'react'
import '@testing-library/jest-dom'

import Modal from '../../../../src/common/components/Modal/Modal'
import {render,screen} from '@testing-library/react'


test('renders component and check classes', () =>{
    render(<Modal show = {true}/> )

    const firstDiv = screen.getByTestId('divOne')
    const secondDiv = screen.getByTestId('divTwo')
    const firstButton = screen.getByTestId('buttonOne')

    expect(firstDiv).toHaveClass('fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50')
    expect(secondDiv).toHaveClass('bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full')
    expect(firstButton).toHaveClass('mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-500')
} )