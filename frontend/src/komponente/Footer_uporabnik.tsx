import React from 'react';
import {
    FaInstagram, FaFacebook, FaLinkedin, FaHome, FaEnvelope,
    FaPhone
} from "react-icons/fa";
import '../Styles/footer_basic.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const Footer_uporabnik: React.FC = (props: any) => {


    return (
        <>
            <footer>
                <Box className='footer_basic'>
                    <Grid container spacing={5}>
                        <Grid item lg={6} md={5} xs={12}>
                            <h6 className='h6_socials'>
                                Povežite se z našimi socialnimi omrežji:
                            </h6>
                        </Grid>
                        <Grid item lg={6} md={7} xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <a href="" className=''>
                                        <FaInstagram className='ikona' />
                                    </a>
                                </Grid>
                                <Grid item xs={4}>
                                    <a href="" className=''>
                                        <FaFacebook className='ikona' />
                                    </a>
                                </Grid>
                                <Grid item xs={4}>
                                    <a href="" className=''>
                                        <FaLinkedin className='ikona' />
                                    </a>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider></Divider>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item md={4} xs={12}>
                                    <h2 className='h2_left'>KONFERENCA</h2>
                                    <p className='p_left'>Spletna stran je bila vzpostavljena za namen prihajajoče konference in se
                                        bo uporabljala le za namene te konference.</p>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <h2 className='h2_left'>POVEZAVE</h2>
                                    <a href="/konferenca" className='povezava_footer'>Konferenca</a>
                                    <br />
                                    <a href="/QR-koda-scan" className='povezava_footer'>Skeniraj QR kodo</a>
                                    <br />
                                    <a href="" className='povezava_footer'>Uredi profil</a>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <h2 className='h2_left'>KONTAKT</h2>
                                    <p className='p_kontakt'><FaHome className='ikona_kontakt' /> FERI, Koroška cesta 46, 2000 Maribor</p>
                                    <p className='p_kontakt'><FaEnvelope className='ikona_kontakt' /> nekaj@gmail.com</p>
                                    <p className='p_kontakt'><FaPhone className='ikona_kontakt' /> +386 041 123 456</p>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                <Box className='sub_footer'>
                <Grid container>
                    <Grid item xs={12}>
                        © 2023 Copyright: FERI
                    </Grid>
                </Grid>
                </Box>
            </footer>
        </>
    );
}

export default Footer_uporabnik;
