import React from 'react';
import { act, fireEvent, getByRole, render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Prijava_uporabnik from '../strani/Prijava_uporabnik';

test('Preveri če obstaja input field za Email', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Prijava_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputEmail2 = screen.getByLabelText(/Email/i);
    expect(inputEmail2).toBeInTheDocument();

});

test('Preveri če obstaja input field za geslo', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Prijava_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputGeslo = screen.getByLabelText(/Geslo/i);
    expect(inputGeslo).toBeInTheDocument();

});

test('Preveri klik gumba za pošiljanje', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Prijava_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });
    const inputEmail = screen.getByLabelText(/Email/i);
    const buttonPrijava = screen.getByRole("button", {name: "Prijava"}) as HTMLButtonElement;
    fireEvent.click(buttonPrijava);
        
});