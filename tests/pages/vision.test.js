import React from 'react'
import '@testing-library/jest-dom'
import {screen,render} from '@testing-library/react'
import MissionVision from "../../src/pages/Vision/Vision";

test('tests class names', () =>{
render(<MissionVision/>)

  // Verificar el contenedor principal
  const mainContainer = screen
    .getByText('Vision')
    .closest('div.px-20.mt-6')
    .querySelector('div > h1');
  expect(mainContainer).toHaveClass('text-2xl font-semibold text-center mt-6');

  // Verificar el título (h1)
  const title = screen.getByText('Vision');
  expect(title).toHaveClass('text-2xl font-semibold text-center mt-6');

  // Verificar el párrafo
  const paragraph = screen.getByText(/Saayam envisions a world/i);
  expect(paragraph).toHaveClass('mt-5 text-lg px-5');

  // Verificar la imagen
  const image = screen.getByAltText('vision');
  expect(image).toHaveClass('w-[350rem] h-80 mt-5');

})
