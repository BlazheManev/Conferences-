import React from 'react';
import { act, fireEvent, getByRole, render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Prijava_uporabnik from '../strani/Prijava_uporabnik';
import Registracija_uporabnik from '../strani/Registracija_uporabnik';

test('Preveri če obstaja input field za Email', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Registracija_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputEmail2 = screen.getByLabelText(/Email/i);
    expect(inputEmail2).toBeInTheDocument();

});

test('Preveri če obstaja input field za Geslo', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Registracija_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputGeslo = screen.getByLabelText(/Geslo/i);
    expect(inputGeslo).toBeInTheDocument();

});

test('Preveri če obstaja input field za ponovno geslo', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Registracija_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputGesloPonovi = screen.getByLabelText(/Ponovi geslo/i);
    expect(inputGesloPonovi).toBeInTheDocument();

});

test('Preveri če obstaja input field za Ime', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Registracija_uporabnik />} />
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
                    <Route path="*" element={<Registracija_uporabnik />} />
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
                    <Route path="*" element={<Registracija_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputInvalidnost = screen.getByLabelText(/Gibalna oviranost/i);
    expect(inputInvalidnost).toBeInTheDocument();

});


//////////////////////////////////////////////

test('Preveri spremembo ob input za email', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Registracija_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputEmail2 = screen.getByLabelText(/Email/i);
    fireEvent.change(inputEmail2, {target: {value: "test@test.te"}});
    expect((inputEmail2 as HTMLInputElement).value).toBe("test@test.te");

});

test('Preveri spremembo ob input za geslo', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Registracija_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputGeslo = screen.getByLabelText(/Geslo/i);
    fireEvent.change(inputGeslo, {target: {value: "123456"}});
    expect((inputGeslo as HTMLInputElement).value).toBe("123456");

});

test('Preveri spremembo ob input za ponovi geslo', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Registracija_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputGesloPonovi = screen.getByLabelText(/Ponovi geslo/i);
    fireEvent.change(inputGesloPonovi, {target: {value: "123456"}});
    expect((inputGesloPonovi as HTMLInputElement).value).toBe("123456");

});

test('Preveri spremembo ob input za ime', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Registracija_uporabnik />} />
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
                    <Route path="*" element={<Registracija_uporabnik />} />
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
                    <Route path="*" element={<Registracija_uporabnik />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputInvalidnost = screen.getByLabelText(/Gibalna oviranost/i);
    fireEvent.click(inputInvalidnost);
    expect(inputInvalidnost).toHaveProperty('checked', true);

});