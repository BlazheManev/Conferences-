import React from 'react';
import {
    FaInstagram, FaFacebook, FaLinkedin
} from "react-icons/fa";
import '../Styles/footer_basic.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const Footer_organizator: React.FC = (props: any) => {


    return (
        <>
            <footer>
                <Box className='footer_basic'>
                    <Grid container spacing={5}>
                        <Grid item lg={6} md={5} xs={12}>
                            <h6 className='h6_socials'>
                                Povezave do socialnih omrežij:
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
                                    <h2 className='h2_left'>POVEZAVE ZA KONFERENCO</h2>
                                    <a href="/organizator/konferenca" className='povezava_footer'>Pregled konference</a>
                                    <br />
                                    <a href="/organizator/upravljanje" className='povezava_footer'>Vnesi konferenco</a>
                                    <br />
                                    <a href="/organizator/prostor-in-vsebina" className='povezava_footer'>Dodaj prostor in vsebine</a>
                                    <br />
                                    <a href="/organizator/urnik" className='povezava_footer'>Ustvari urnik</a>
                                    <br />
                                    <a href="/QR-koda" className='povezava_footer'>QR koda</a>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <h2 className='h2_left'>POVEZAVE ZA UPORABNIKA</h2>
                                    <a href="/organizator/dodaj-udelezenca" className='povezava_footer'>Pošlki povabila</a>
                                    <br />
                                    <a href="/organizator/obvestilo" className='povezava_footer'>Pošlji obvestilo</a>
                                    <br />
                                    <a href="/organizator/lastnosti-in-udeleženci" className='povezava_footer'>Seznam udeležencev</a>
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

export default Footer_organizator;
