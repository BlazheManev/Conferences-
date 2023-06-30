import React, { useRef } from 'react';
import { FaBars, FaTimes } from "react-icons/fa";
import '../Styles/nav_home.css';
import conference_image from '../Styles/conference_image.png';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';

const Nav_home: React.FC = (props: any) => {

    const navRef = useRef<HTMLDivElement>(null);

    const showNavbar = () => {
        if (navRef.current) {
            navRef.current.classList.toggle("responsive_nav");
            const element = document.getElementById('skrij');
            console.log(element);
            element?.classList.toggle("gumb-skrij");
        }
    };


    return (
        <>
            <CssBaseline />
            <div className='full'>
                <header>
                    <h3>KONFERENCA</h3>
                    <nav ref={navRef}>
                        <a href="/">Domov</a>
                        <a href="organizator-prijava">Organizator</a>
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
                <Box className="box-sirina" sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid className='grid_center' item lg={5} md={5}>
                            <div>
                                <h1>Vabljeni na našo konferenco</h1>
                                <p>Za potrditev udeležbe na našo konferenco, se je najprej potrebno registrirati.
                                    Naprošamo vas tudi, da nam čim prej sporočite udeležbo, da lahko konferenco organiziramo
                                    primerno številu udeležencev.
                                </p>
                                <Button variant="outlined" id='skrij' className='' href="/registracija">
                                    Registrirajte se
                                </Button>

                            </div>
                        </Grid>
                        <Grid item lg={7} md={7}>
                            <div>
                                <img className='header_slika' src={conference_image} alt="slika konference" />
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    );
}

export default Nav_home;
