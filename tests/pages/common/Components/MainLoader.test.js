import React from 'react' 
import '@testing-library/jest-dom'
import {screen,render} from '@testing-library/react'
import MainLoader from '../../../../src/common/components/Loader/MainLoader'

test('checks div render and class', () =>{

    render(<MainLoader/>)

    const mainDiv = screen.getByTestId('divOne')
    expect(mainDiv).toHaveClass('main-loader')
})