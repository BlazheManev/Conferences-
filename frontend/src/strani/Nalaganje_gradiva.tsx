//stran namenjena dodajanju prostora, specifikacij in gradiva ter prispevkov
import React from 'react';
import { Helmet } from 'react-helmet';
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { FormEvent } from 'react';
import { Gradivo } from '../razredi/gradivo';
import Nav_organizator from '../komponente/Nav_organizator';
//import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Footer_organizator from '../komponente/Footer_organizator';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from "@mui/material/Button";
import '../Styles/prijava_uporabnik.css';
import {
    FaTimes
} from "react-icons/fa";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

interface DodajGradivoProps {
    onAdd: (prostor: Gradivo) => any;
}

const Nalaganje_gradiva: React.FC<DodajGradivoProps> = (props: DodajGradivoProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const URL = process.env.REACT_APP_URL;
    //const [naslov, setNaslov] = useState("");
    //const [avtor, setAvtor] = useState("");
    //const [jePrispevek, setPrispevek] = useState(false);
    const [seznamGradiva, setGradiva] = useState<any[]>([]);

    const [errorMsgNaslov, setErrorMsgNaslov] = useState<string>("");
    const [naslovError, setNaslovError] = useState<boolean>(false);

    const [errorMsgAvtor, setErrorMsgAvtor] = useState<string>("");
    const [avtorError, setAvtorError] = useState<boolean>(false);

    ////////////
    const [organizer, setOrganizer] = useState<boolean | null>(null);
    const [token, setToken] = useState<String>("null");

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
    ///////////////

    const [data, setData] = React.useState({
        naslov: "",
        avtor: "",
        jePrispevek: false
    });

    const [jePrispevek, setPrisp] = React.useState(false);     /////////////

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    const handleCheck = () => {
        setPrisp(!jePrispevek);
    };


    const handleSubmit = async (e: FormEvent) => {
        //e.preventDefault();

        setNaslovError(false);
        setErrorMsgNaslov("");
        setAvtorError(false);
        setErrorMsgAvtor("");

        if (data.naslov == "") {
            setNaslovError(true);
            setErrorMsgNaslov("Vnesite naslov");
            return;
        }

        if (data.avtor == "") {
            setAvtorError(true);
            setErrorMsgAvtor("Vnesite avtorja");
            return;
        }

        try {
            const files = fileInputRef.current?.files;
            const formData = new FormData();
            console.log(jePrispevek);
            formData.append("naslov", JSON.stringify(data.naslov));
            formData.append("avtor", JSON.stringify(data.avtor));
            //formData.append("jePrispevek", JSON.stringify(jePrispevek));
            formData.append("jePrispevek", JSON.stringify(data.jePrispevek));
            formData.append("file", files![0]);

            fetch(URL + "/gradivo", {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then(response => {
                if (response.status === 200) {
                    console.log(response);
                    response.json().then(data => {
                        console.log("status 200");
                        window.location.reload();
                        //localStorage.getItem("token");              //???
                    }).catch(error => {
                        console.error('There was an error!', error);
                    });
                }
            }).catch(error => {
                console.error('There was an error!', error);
            });
        } catch (error) {
            console.log(error);
        }

    }

    const handleOrganizer = async () => {
        const email = sessionStorage.getItem('emailOrganizator');
        try {
            const response = await fetch(URL + '/organizator/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            console.log(data)

            const token = data.token;
            setToken(token)
            setOrganizer(data.token);

            fetch(URL + '/gradivo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`

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

        } catch (error) {
            console.log(error);
        }
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

    const odstraniDatoteko = async (id: MouseEvent) => {

        fetch(URL + `/gradivo/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            if (response.status === 200) {
                console.log(response);
                response.json().then(data => {
                    console.log("status 200");
                    window.location.reload();
                    //localStorage.getItem("token");              //???
                }).catch(error => {
                    console.error('There was an error!', error);
                });
            }
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }

    return (
        <>
            <Helmet>
                <title>Nalaganje gradiva</title>
            </Helmet>
            <Nav_organizator></Nav_organizator>


            <Box className="box-sirina_2 box-izgled" sx={{ flexGrow: 1 }}>
                <Grid container className='vsebina_forma_in_seznam' spacing={2}>
                    <Grid item className='vsebina-box' lg={12} xs={12}>
                        <h1>Vnesite podatke o gradivu</h1>
                        <Grid container>

                            <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                                <TextField error={naslovError} helperText={errorMsgNaslov}
                                    sx={{
                                        width: { xs: "auto" },
                                        input: {
                                            color: "#fff",
                                        },
                                    }}
                                    InputLabelProps={{
                                        style: { color: "#2e77ae" },
                                    }}
                                    id="text_field1" className='textField-dodajanjeUdelezenca skrij' label="Naslov gradiva" fullWidth variant="filled"
                                    value={data.naslov} onChange={event => setData((prevState) => ({ ...prevState, ["naslov"]: event.target.value }))} />
                            </Grid>

                            <Grid item className='textField-zadeva' xs={12}>
                                <TextField error={avtorError} helperText={errorMsgAvtor}
                                    sx={{
                                        width: { xs: "auto" },
                                        input: {
                                            color: "#fff",
                                        },
                                    }}
                                    InputLabelProps={{
                                        style: { color: "#2e77ae" },
                                    }}
                                    id="outlined-basic" className='skrij' label="Avtor gradiva" variant="filled"
                                    value={data.avtor} onChange={event => setData((prevState) => ({ ...prevState, ["avtor"]: event.target.value }))} />
                            </Grid>

                            <Grid item className='textField-zadeva skrij' xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Označite, če je gradivo prispevek</FormLabel>
                                    <FormGroup aria-label="position" row>
                                        <FormControlLabel
                                            value="start"
                                            control={<Checkbox
                                                checked={data.jePrispevek}
                                                onChange={event => setData((prevState) => ({ ...prevState, ["jePrispevek"]: event.target.checked }))}
                                            //onChange={event => setPrisp((prevState) => (handleCheck()))}
                                            />}
                                            label="Gradivo je prispevek"
                                            labelPlacement="start"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>

                            <Grid item className='textField-zadeva skrij' xs={12}>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    IZBERI DATOTEKO
                                    <input
                                        type="file"
                                        hidden
                                        ref={fileInputRef}
                                    />
                                </Button>
                            </Grid>

                            <Grid item className='textField-zadeva' xs={12}>
                                <Button variant="outlined" className='skrij' onClick={handleSubmit}>Naloži</Button>
                            </Grid>

                        </Grid>

                    </Grid>
                </Grid>
            </Box>

            <Grid item className='' xs={12}>

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
                                    <TableCell sx={{ color: "#eee" }} >
                                        <Button variant="outlined" className='skrij' onClick={() => odstraniDatoteko(row._id)}>Odstrani</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Grid>

            <Footer_organizator></Footer_organizator>
        </>
    )
}

export default Nalaganje_gradiva;