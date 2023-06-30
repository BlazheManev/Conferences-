import React from 'react';
import { act, render, screen } from '@testing-library/react';
import Nav_uporabnik from '../komponente/Nav_uporabnik';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

test('Preveri če obstaja link Konferenca in naslov konferenca', () => {
    act(() => {
        render(
        <BrowserRouter>
            <Routes>   
                <Route path="*" element= {<Nav_uporabnik/>}/>
            </Routes>
        </BrowserRouter>);
        });
    const linkElementarr = screen.getAllByText(/Konferenca/i);
    for (let i = 0; i < linkElementarr.length; i++) {
        const element = linkElementarr[i];
        expect(element).toBeInTheDocument();
        
    }
});