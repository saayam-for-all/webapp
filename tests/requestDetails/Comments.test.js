// Archivo: Comments.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comments from '../../src/pages/RequestDetails/Comments'; // Ajusta el path si es necesario
import avatar from '../../src/assets/avatar.jpg'; // Ajusta el path si es necesario

describe('Comments component', () => {
  const name = 'John Doe';
  const message = 'This is a test comment.';
  const date = '2023-10-01';

  test('renders with correct content', () => {
    // Renderiza el componente con los props de prueba
    render(<Comments name={name} message={message} date={date} />);

    // Verifica que el nombre esté presente
    expect(screen.getByText(name)).toBeInTheDocument();

    // Verifica que el avatar tenga el atributo src correcto
    const avatarImg = screen.getByAltText(name);
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute('src', avatar);

    // Verifica que la fecha esté presente
    expect(screen.getByText(date)).toBeInTheDocument();

    // Verifica que el mensaje se renderice correctamente
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    // Renderiza el componente
    render(<Comments name={name} message={message} date={date} />);

    // Verifica las clases CSS del contenedor principal
    const sectionElement = screen.getByText(message).closest('section');
    expect(sectionElement).toHaveClass('pt-6 mb-3 text-base bg-white border-t border-gray-200');

    // Verifica las clases CSS de la imagen
    const avatarImg = screen.getByAltText(name);
    expect(avatarImg).toHaveClass('mr-2 w-8 h-8 rounded-full');

    // Verifica las clases CSS del nombre
    const nameElement = screen.getByText(name);
    expect(nameElement).toHaveClass('inline-flex items-center mr-3 text-sm text-gray-900 font-semibold');

    // Verifica las clases CSS del mensaje
    const messageElement = screen.getByText(message);
    expect(messageElement).toHaveClass('text-gray-500');
  });
});
