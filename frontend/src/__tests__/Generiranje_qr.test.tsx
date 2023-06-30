import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Generiranje_qr_kode from '../strani/Generiranje_qr_kode';

test('Preveri če obstaja qr-koda', () => {
    act(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Generiranje_qr_kode />} />
                </Routes>
            </BrowserRouter>);
    });
    const testImage = document.querySelector("img") as HTMLImageElement;
    console.log(testImage);
    expect(testImage.src).toContain("Feri_logo_bw.png");
        
});