import React from 'react'
import '@testing-library/jest-dom'
import {render,screen} from '@testing-library/react'
import { Tabs } from '../../../../src/common/components/Tabs/Tabs'

test('checks div classes', () =>{

    render(<Tabs>
        <div label="Tab 1" data-testid="divOne" className="flex">Content of Tab 1</div>
        <div label="Tab 2" data-testid="divTwo" className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
          Content of Tab 2
        </div>
        <div label="Tab 3" data-testid="divThree">Content of Tab 3</div>
      </Tabs>)

    const firstDiv = screen.getByTestId('divOne')
    const secondDiv = screen.getByTestId('divTwo')
    const thirdDiv = screen.getByTestId('divThree')

    expect(firstDiv).toHaveClass('flex')
    expect(secondDiv).toHaveClass('text-sm font-medium text-center text-gray-500 border-b border-gray-200')
    expect(thirdDiv).toBeInTheDocument()
})