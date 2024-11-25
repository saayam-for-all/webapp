// Archivo: Comments.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comments from '../../src/pages/RequestDetails/Comments'; 
import avatar from '../../src/assets/avatar.jpg'; 

describe('Comments component', () => {
  const name = 'John Doe';
  const message = 'This is a test comment.';
  const date = '2023-10-01';

  test('renders with correct content', () => {
    
    render(<Comments name={name} message={message} date={date} />);

    
    expect(screen.getByText(name)).toBeInTheDocument();

    
    const avatarImg = screen.getByAltText(name);
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute('src', avatar);

    
    expect(screen.getByText(date)).toBeInTheDocument();

    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    
    render(<Comments name={name} message={message} date={date} />);

    
    const sectionElement = screen.getByText(message).closest('section');
    expect(sectionElement).toHaveClass('pt-6 mb-3 text-base bg-white border-t border-gray-200');

    
    const avatarImg = screen.getByAltText(name);
    expect(avatarImg).toHaveClass('mr-2 w-8 h-8 rounded-full');

    
    const nameElement = screen.getByText(name);
    expect(nameElement).toHaveClass('inline-flex items-center mr-3 text-sm text-gray-900 font-semibold');

    
    const messageElement = screen.getByText(message);
    expect(messageElement).toHaveClass('text-gray-500');
  });
});
