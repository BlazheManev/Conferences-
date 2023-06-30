import React from 'react';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Button from "@mui/material/Button";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Nav_uporabnik from '../komponente/Nav_uporabnik';
import '../Styles/prenos_gradiva.css';
import Footer_uporabnik from '../komponente/Footer_uporabnik';

const Prenos_gradiva: React.FC = (props: any) => {
    const URL = process.env.REACT_APP_URL;
    const [seznamGradiva, setGradiva] = useState<any[]>([]);

    const [organizer, setOrganizer] = useState<boolean | null>(null);
    const [token, setToken] = useState<String | null>("null");

    const navigate = useNavigate();

    useEffect(() => {
        handleOrganizer().catch(error => {
            console.error('There was an error!', error);
        });

    }, []);

    useEffect(() => {
        if (organizer === null) {
            return;
        }

        if (!organizer) {
            navigate("/");
        }
    }, [organizer, navigate]);

    const handleOrganizer = async () => {
        const auth = sessionStorage.getItem('auth');
        console.log(auth)

        setToken(auth);

        fetch(URL + '/gradivo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${auth}`
            }
        })
            .then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response statusText
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                } else {
                    let vsi = [];
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];

                        if (element.naslov !== undefined && element.avtor !== undefined && element.jePrispevek !== undefined && element.file !== undefined) {
                            vsi.push(element);
                            console.log(element.naslov);
                        }
                    }
                    setGradiva(vsi);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const naloziDatoteko = async (id: MouseEvent) => {
        try {
            const res = await axios.get(
                URL + `/gradivo/download/${id}`,
                //`http://localhost:3001/gradivo/download/${id}`,
                {
                    responseType: "blob",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const blob = new Blob([res.data], { type: res.data.type });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "Gradivo";
            link.click();


        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const auth = sessionStorage.getItem('auth');
        console.log(auth);
        if (auth === null) {
            navigate('/');
        }
        setToken(auth);
        if (token !== null) {

            handleOrganizer().catch(error => {
                console.error('There was an error!', error);
            });
        }
        //pridobiVseUporabnike();
        //pridobiKonferenco();
        //pridobiProstor();
        //Runs on the first render
        //And any time any dependency value changes
    }, [token]);

    return (
        <>
            <Helmet>
                <title>Gradivo</title>
            </Helmet>
            <Nav_uporabnik></Nav_uporabnik>
            <Row>
                <Col></Col>
                <Col xs={10} md={6} className='center'>
                    <h1 className='center'>
                        Gradivo za konferenco:
                    </h1>
                </Col>
                <Col></Col>
            </Row>

            <Grid item className='box-padding-dodaten-prenos-gradiva' xs={12}>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 100, backgroundColor: '#193c5f', color: "#eee" }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: "#eee" }}><b>Naslov</b></TableCell>
                                    <TableCell sx={{ color: "#eee" }} ><b>Avtor</b></TableCell>
                                    <TableCell sx={{ color: "#eee" }} ><b></b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {seznamGradiva.map((row) => (
                                    <TableRow
                                        key={row._id}
                                    >
                                        <TableCell sx={{ color: "#eee" }} component="th" scope="row">
                                            {row.naslov}
                                        </TableCell>
                                        <TableCell sx={{ color: "#eee" }} >{row.avtor}</TableCell>
                                        <TableCell sx={{ color: "#eee" }} >
                                        <Button variant="outlined" className='skrij' onClick={() => naloziDatoteko(row._id)}>Prenesi</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

            </Grid>
            <Footer_uporabnik></Footer_uporabnik>
        </>
    )

}

export default Prenos_gradiva;