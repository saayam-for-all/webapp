import React from "react";
import '@testing-library/jest-dom';
import MissionVision from "../../src/pages/Mission/Mission";
import { render, screen } from '@testing-library/react';

test('mission vision render', () =>{
    render(<MissionVision/>)

    const title = screen.getByRole('heading', { level: 1 });

    expect(title).toHaveClass('text-2xl font-semibold text-center')

})