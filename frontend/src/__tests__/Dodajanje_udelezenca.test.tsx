import React from 'react';
import { act, fireEvent, getByRole, render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dodajanje_udelezenca from '../strani/Dodajanje_udelezenca';

test('Preveri če obstaja input field za Email', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Dodajanje_udelezenca />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputEmail2 = screen.getByLabelText(/Email/i);
    expect(inputEmail2).toBeInTheDocument();

});

test('Preveri vnašanje v input field email', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Dodajanje_udelezenca />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputEmail2 = screen.getByLabelText(/Email/i);
    fireEvent.change(inputEmail2, {target: {value: "nekaj@google.si"}});
    expect((inputEmail2 as HTMLInputElement).value).toBe("nekaj@google.si");

});

test('Preveri dodajanje emaila', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Dodajanje_udelezenca />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputEmail2 = screen.getByLabelText(/Email/i);
    fireEvent.change(inputEmail2, {target: {value: "nekaj@google.si"}});
    expect((inputEmail2 as HTMLInputElement).value).toBe("nekaj@google.si");
    const eamilButton = screen.getByRole("button", {name: "Dodaj"}) as HTMLButtonElement;
    fireEvent.click(eamilButton);
    expect((inputEmail2 as HTMLInputElement).value).toBe("");

});


test('Preveri prikaz dodanega emaila', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Dodajanje_udelezenca />} />
                </Routes>
            </BrowserRouter>);
    });

    const inputEmail2 = screen.getByLabelText(/Email/i);
    fireEvent.change(inputEmail2, {target: {value: "nekaj@google.si"}});
    expect((inputEmail2 as HTMLInputElement).value).toBe("nekaj@google.si");
    const eamilButton = screen.getByRole("button", {name: "Dodaj"}) as HTMLButtonElement;
    fireEvent.click(eamilButton);
    expect((inputEmail2 as HTMLInputElement).value).toBe("");
    const prikaz = screen.getByText("nekaj@google.si") as HTMLSpanElement;
    expect(prikaz.innerHTML).toBe("nekaj@google.si");


});