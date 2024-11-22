import React from 'react'
import Footer from "../../../../src/common/components/Footer/Footer";
import '@testing-library/jest-dom'
import {screen,render} from '@testing-library/react'

test('footer render,class and content',() => {
    render(<Footer/>)

    const footerDiv = screen.getByTestId('footer-div')
    expect(footerDiv).toHaveClass('bg-slate-200 text-center p-1')
    const footerText = screen.getByTestId('footer-text')
    expect(footerText).toHaveTextContent('Copyright © 2024 Saayam. All Rights Reserved')
})