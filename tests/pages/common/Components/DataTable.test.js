import React from 'react';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table from '../../../../src/common/components/DataTable/Table';
import { MemoryRouter } from 'react-router';


test('it renders table and checks classes', () => {
  
  const mockHeaders = ['id', 'name'];
  const mockRows = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];

  const mockSetCurrentPage = jest.fn();
  const mockRequestSort = jest.fn();
  const mockGetLinkPath = jest.fn(() => '/mock-link');
  const mockOnRowsPerPageChange = jest.fn();

  
  render(<MemoryRouter>
    <Table
      headers={mockHeaders} 
      rows={mockRows} 
      currentPage={1}
      setCurrentPage={mockSetCurrentPage}
      totalPages={2}
      totalRows={mockRows.length}
      itemsPerPage={2}
      sortConfig={{ key: 'name', direction: 'ascending' }}
      requestSort={mockRequestSort}
      onRowsPerPageChange={mockOnRowsPerPageChange}
      getLinkPath={mockGetLinkPath}
    />
    </MemoryRouter>
  );

  const container = screen.getByTestId('container');
  expect(container).toHaveClass('relative');

  const table = screen.getByTestId('table');
  expect(table).toBeInTheDocument();

  const tableHeader = screen.getByTestId('table-header')
  expect(tableHeader).toHaveClass("bg-gray-50")
  const tableBody = screen.getByTestId('table-body')
  expect(tableBody).toHaveClass("bg-white divide-y divide-gray-200")

  const mapHeaders = screen.getAllByTestId('map-header-one');
  mapHeaders.forEach(header => {
    expect(header).toHaveClass('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider');
  });

  const mapHeaderTwo = screen.getAllByTestId('map-data-one');
  mapHeaderTwo.forEach(header => {
    expect(header).toHaveClass("px-6 py-4 whitespace-nowrap")
  })
  

  const rows = screen.getAllByRole('row');
  expect(rows).toHaveLength(mockRows.length + 1); 
});
