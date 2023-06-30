import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Obvestilo from '../strani/Obvestilo';

test('Preveri če obstaja input field zadeva', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Obvestilo />} />
                </Routes>
            </BrowserRouter>);
    });
    const inputZadeva = screen.getByLabelText(/Zadeva/i);
    expect(inputZadeva).toBeInTheDocument();
        
});

test('Preveri če obstaja input field vsebina', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Obvestilo />} />
                </Routes>
            </BrowserRouter>);
    });
    const inputVsebina = screen.getByLabelText(/Vsebina/i);
    expect(inputVsebina).toBeInTheDocument();
        
});

test('Preveri spremembo value ob onChange zadeve in vsebine', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Obvestilo />} />
                </Routes>
            </BrowserRouter>);
    });
    const inputVsebina = screen.getByLabelText(/Vsebina/i);
    const inputZadeva = screen.getByLabelText(/Zadeva/i);

    fireEvent.change(inputZadeva, {target: {value: "Test zadeve"}});
    expect((inputZadeva as HTMLInputElement).value).toBe("Test zadeve");

    fireEvent.change(inputVsebina, {target: {value: "Test vsebine"}});
    expect((inputVsebina as HTMLInputElement).value).toBe("Test vsebine");
        
});

test('Preveri spremembe ob kliku na gumb za pošiljanje', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Obvestilo />} />
                </Routes>
            </BrowserRouter>);
    });
    const inputVsebina = screen.getByLabelText(/Vsebina/i);
    const inputZadeva = screen.getByLabelText(/Zadeva/i);

    fireEvent.change(inputZadeva, {target: {value: "Test zadeve"}});
    expect((inputZadeva as HTMLInputElement).value).toBe("Test zadeve");

    fireEvent.change(inputVsebina, {target: {value: "Test vsebine"}});
    expect((inputVsebina as HTMLInputElement).value).toBe("Test vsebine");

    const eamilButton = screen.getByRole("button", {name: "Pošlji obvestilo"}) as HTMLButtonElement;
    fireEvent.click(eamilButton);
        
});