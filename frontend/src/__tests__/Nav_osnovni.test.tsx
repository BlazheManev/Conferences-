import React from 'react';
import { render, screen } from '@testing-library/react';
import Nav_osnovni from '../komponente/Nav_osnovni';

test('Preveri če obstaja link prijava', () => {
    render(<Nav_osnovni />);
    const linkElement = screen.getByText(/Prijava/i);
    expect(linkElement).toBeInTheDocument();
});

test('Preveri ali je v nav-u konferenca', () => {
    render(<Nav_osnovni />);
    const linkElement = screen.getByText(/Konferenca/i);
    expect(linkElement).toBeInTheDocument();
  });