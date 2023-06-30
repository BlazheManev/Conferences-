import React from 'react';
import { act, fireEvent, getByRole, render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Vnos_prostora_specifikacije from '../strani/Vnos_prostora_specifikacije';
import { Prostor } from '../razredi/prostor';

test('Preveri če obstaja input field za naziv prostora', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Vnos_prostora_specifikacije onAdd={function (prostor: Prostor) {
                        throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputIme = screen.getByLabelText(/Naziv prstora/i);
    expect(inputIme).toBeInTheDocument();

});

test('Preveri če obstaja input field za Naslov stavbe', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Vnos_prostora_specifikacije onAdd={function (prostor: Prostor) {
                        throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputPriimek = screen.getByLabelText(/Naslov stavbe/i);
    expect(inputPriimek).toBeInTheDocument();

});

test('Preveri če obstaja input field za Število sedežev', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Vnos_prostora_specifikacije onAdd={function (prostor: Prostor) {
                        throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputPriimek = screen.getByLabelText(/Število sedežev/i);
    expect(inputPriimek).toBeInTheDocument();

});

test('Preveri če obstaja checkbox za Gibalna oviranost', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Vnos_prostora_specifikacije onAdd={function (prostor: Prostor) {
                        throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputInvalidnost = screen.getByLabelText(/Dostopno gibalno oviranim osebam/i);
    expect(inputInvalidnost).toBeInTheDocument();

});


//////////////////////////////////////////////

test('Preveri spremembo ob input za Naziv prstora', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Vnos_prostora_specifikacije onAdd={function (prostor: Prostor) {
                        throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputIme = screen.getByLabelText(/Naziv prstora/i);
    fireEvent.change(inputIme, {target: {value: "Testni naziv"}});
    expect((inputIme as HTMLInputElement).value).toBe("Testni naziv");

});

test('Preveri čspremembo ob input za Naslov stavbe', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Vnos_prostora_specifikacije onAdd={function (prostor: Prostor) {
                        throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputPriimek = screen.getByLabelText(/Naslov stavbe/i);
    fireEvent.change(inputPriimek, {target: {value: "MB, 2000, Štukova cesta 30"}});
    expect((inputPriimek as HTMLInputElement).value).toBe("MB, 2000, Štukova cesta 30");

});

test('Preveri čspremembo ob input za Število sedežev', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Vnos_prostora_specifikacije onAdd={function (prostor: Prostor) {
                        throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputPriimek = screen.getByLabelText(/Število sedežev/i);
    fireEvent.change(inputPriimek, {target: {value: 90}});
    expect((inputPriimek as HTMLInputElement).value).toBe("90");

});

test('Preveri spremembo za checkbox gibalna oviranost', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Vnos_prostora_specifikacije onAdd={function (prostor: Prostor) {
                        throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputInvalidnost = screen.getByLabelText(/Dostopno gibalno oviranim osebam/i);
    fireEvent.click(inputInvalidnost);
    expect(inputInvalidnost).toHaveProperty('checked', true);

});