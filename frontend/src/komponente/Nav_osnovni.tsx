import React, { useRef } from 'react';
import { FaBars, FaTimes } from "react-icons/fa";
import '../Styles/nav_home.css';
import CssBaseline from '@mui/material/CssBaseline';

const Nav_osnovni: React.FC = (props: any) => {

    const navRef = useRef<HTMLDivElement>(null);

    const showNavbar = () => {
        if (navRef.current) {
            navRef.current.classList.toggle("responsive_nav");
            const elementi = document.getElementsByClassName("skrij");
            const element = document.getElementById('skrij');
            for (let i = 0; i < elementi.length; i++) {
                const el = elementi[i];
                el.classList.toggle("gumb-skrij");
            }
            console.log(element);
            element?.classList.toggle("gumb-skrij");
        }
    };


    return (
        <>
            <CssBaseline />
            <div>
                <header>
                    <h3>KONFERENCA</h3>
                    <nav ref={navRef}>
                        <a href="/">Domov</a>
                        <a href="/organizator-prijava">Organizator</a>
                        <a href="/prijava">Prijava</a>
                        <a href="/registracija">Registracija</a>
                        <button
                            className="nav-btn nav-close-btn"
                            onClick={showNavbar}>
                            <FaTimes />
                        </button>
                    </nav>
                    <button
                        className="nav-btn"
                        onClick={showNavbar}>
                        <FaBars />
                    </button>
                </header>
            </div>
        </>
    );
}

export default Nav_osnovni;
