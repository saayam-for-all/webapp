import React from 'react'
import '@testing-library/jest-dom'
import {screen,render} from '@testing-library/react'
import LeftAds from '../../../../src/common/components/LeftAds/LeftAds'

test('checks elements render', () =>{
    render(<LeftAds/>)

    const mainDiv = screen.getByTestId('divOne')
    expect(mainDiv).toBeInTheDocument()
})