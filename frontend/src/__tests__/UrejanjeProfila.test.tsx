import React from 'react';
import { act, fireEvent, getByRole, render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Prijava_uporabnik from '../strani/Prijava_uporabnik';
import Registracija_uporabnik from '../strani/Registracija_uporabnik';
import UrejenjeProfila from '../strani/UrejenjeProfila';

test('Preveri če obstaja input field za Ime', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<UrejenjeProfila />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputIme = screen.getByLabelText(/Ime/i);
    expect(inputIme).toBeInTheDocument();

});

test('Preveri če obstaja input field za Priimek', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<UrejenjeProfila />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputPriimek = screen.getByLabelText(/Priimek/i);
    expect(inputPriimek).toBeInTheDocument();

});

test('Preveri če obstaja checkbox za Gibalna oviranost', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<UrejenjeProfila />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputInvalidnost = screen.getByLabelText(/Gibalna oviranost/i);
    expect(inputInvalidnost).toBeInTheDocument();

});


//////////////////////////////////////////////

test('Preveri spremembo ob input za ime', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<UrejenjeProfila />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputIme = screen.getByLabelText(/Ime/i);
    fireEvent.change(inputIme, {target: {value: "Testno ime"}});
    expect((inputIme as HTMLInputElement).value).toBe("Testno ime");

});

test('Preveri čspremembo ob input za priimek', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<UrejenjeProfila />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputPriimek = screen.getByLabelText(/Priimek/i);
    fireEvent.change(inputPriimek, {target: {value: "Testni Priimek"}});
    expect((inputPriimek as HTMLInputElement).value).toBe("Testni Priimek");

});

test('Preveri spremembo za checkbox gibalna oviranost', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<UrejenjeProfila />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputInvalidnost = screen.getByLabelText(/Gibalna oviranost/i);
    fireEvent.click(inputInvalidnost);
    expect(inputInvalidnost).toHaveProperty('checked', true);

});