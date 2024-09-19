// npm to be checked ======> npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-jest jest @testing-library/react @testing-library/jest-dom eslint eslint-plugin-react eslint-plugin-react-refresh eslint-plugin-jest

import {render,screen} from '@testing-library/react'
import '@testing-library/jest-dom'; 
import Navbar from "../common/components/Navbar/Navbar";

test('renders Navbar and checks components' , () =>{
    render(<Navbar/>)

    const imageLink = screen.getByRole('img',{className : 'w-14 h-14'})
    const linkOne = screen.getByRole('link', {name:'directors'})
    const linkTwo = screen.getByRole('link',{name:'how-we-operate'})
    const linkThree = screen.getByRole('link',{name:'contact'})

    expect(imageLink).toBeInTheDocument()
    expect(linkOne).toBeInTheDocument()
    expect(linkTwo).toBeInTheDocument()
    expect(linkThree).toBeInTheDocument()
})