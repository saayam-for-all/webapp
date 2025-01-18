// npm to be checked ======> npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-jest jest @testing-library/react @testing-library/jest-dom eslint eslint-plugin-react eslint-plugin-react-refresh eslint-plugin-jest
import React from 'react'
import {render,screen,waitFor} from '@testing-library/react'
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import {store} from '../../../../src/redux/store'


import Navbar from "../../../../src/common/components/Navbar/Navbar"

test('renders Navbar and checks components' , () =>{
    render(  <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>)

    //const imageLink = screen.getByRole('img',{className : 'w-14 h-14'})
    const linkOne = screen.getByRole('link', {name:'directors'})
    //const linkTwo = screen.getByRole('link',{name:'how-we-operate'})
    const linkThree = screen.getByRole('link',{name:'contact'})

    //expect(imageLink).toBeInTheDocument()
    expect(linkOne).toBeInTheDocument()
   // expect(linkTwo).toBeInTheDocument()
    expect(linkThree).toBeInTheDocument()
})

test('First useEffect',async () => {
  let getItemMock;

  beforeEach(() => {
    // Simulamos localStorage.getItem
    getItemMock = jest.spyOn(Storage.prototype, 'getItem');

    // Simulamos que localStorage.getItem('profilePhoto') devuelve una URL
    getItemMock.mockImplementation((key) => {
      if (key === 'profilePhoto') {
        return 'test-photo-url';
      }
      return null;
    });

    // Renderizamos el componente
    render(<Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });
  expect(getItemMock).toHaveBeenCalledWith('profilePhoto');
  await waitFor(() => {
    const profileIcon = screen.getByTestId('profile-icon');
    expect(profileIcon).toHaveAttribute('src', 'test-photo-url');
  }



    // Verificar que el estado de profileIcon se ha actualizado con la URL de localStorage
    // Aquí asumimos que el componente renderiza una imagen con el icono de perfil
 
  ) 
});
