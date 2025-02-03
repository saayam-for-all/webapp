import '@testing-library/jest-dom'
import {render,screen} from '@testing-library/react'
import React from 'react'
import RightAds from '../../../../src/common/components/RightAds/RightAds'

test('renders right ads and check classes', () => {
    render(<RightAds/>)

    const mainDiv = screen.getByTestId('mainDiv');
expect(mainDiv).toBeInTheDocument();


})