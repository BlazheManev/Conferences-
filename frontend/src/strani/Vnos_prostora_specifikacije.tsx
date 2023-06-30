//stran namenjena dodajanju prostora, specifikacij in gradiva ter prispevkov
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Prostor } from '../razredi/prostor';
import Nav_organizator from '../komponente/Nav_organizator';
//import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
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
import Footer_organizator from '../komponente/Footer_organizator';

interface DodajProstorProps {
    onAdd: (prostor: Prostor) => any;
}

const Vnos_prostora_specifikacije: React.FC<DodajProstorProps> = (props: DodajProstorProps) => {

    const [errorMsgNaziv, setErrorMsgNaziv] = useState<string>("");
    const [nazivError, setNazivError] = useState<boolean>(false);
    const [errorMsgSt, setErrorMsgSt] = useState<string>("");
    const [stError, setStError] = useState<boolean>(false);
    const [errorMsgNaslov, setErrorMsgNaslov] = useState<string>("");
    const [naslovError, setNaslovError] = useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const [openNapaka, setOpenNapaka] = React.useState(false);
    const [organizer, setOrganizer] = useState<boolean | null>(null);
    const [token, setToken] = useState<String>("null");
    const URL = process.env.REACT_APP_URL;

    const [lastnosti, setLastnosti] = React.useState({
        naziv: "",
        sedezi: 0,
        dostopnost: false,
        naslov: ""
    });
    const navigate = useNavigate();

    const handleOrganizer = async () => {
        const email = sessionStorage.getItem('emailOrganizator');
        try {
            const response = await fetch(URL + '/organizator/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            const token = data.token;
            setToken(token)
            setOrganizer(data.token);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        setNaslovError(false);
        setErrorMsgNaslov("");
        setNazivError(false);
        setErrorMsgNaziv("");
        setStError(false);
        setErrorMsgSt("");

        if (lastnosti.naziv == "") {
            setNazivError(true);
            setErrorMsgNaziv("Vnesite naziv");
            return;
        }

        if (lastnosti.naslov == "") {
            setNaslovError(true);
            setErrorMsgNaslov("Vnesite naslov");
            return;
        }

        if (lastnosti.sedezi == 0) {
            setStError(true);
            setErrorMsgSt("Število mora biti večje od 0!");
            return;
        }
        let data = {
            naziv: lastnosti.naziv,
            sedezi: lastnosti.sedezi,
            dostopnost: lastnosti.dostopnost,
            naslov: lastnosti.naslov
        }

        fetch(URL + "/prostor", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        }).then( async response => {
            const shranjeno = await response.json();
            console.log(shranjeno.length);

            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (shranjeno && shranjeno.message) || response.statusText;
                return Promise.reject(error);
            } else {
                if(shranjeno.length == 0) {
                    fetch(URL + "/prostor", {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        }
                    }).then(response => {
                        setOpen(false);
                        setOpenNapaka(false);
                        if (response.status === 201) {
                            console.log(response);
                            setOpen(true);
                            response.json().then(data => {
                                console.log("status 200");
                                //localStorage.getItem("token");
                                setNaslovError(false);
                                setErrorMsgNaslov("");
                                setNazivError(false);
                                setErrorMsgNaziv("");
                                setStError(false);
                                setErrorMsgSt("");
                            }).catch(error => {
                                console.error('There was an error!', error);
                            });
                        } else {
                            setOpenNapaka(true);
                        }
                    }).catch(error => {
                        console.error('There was an error!', error);
                    });
                } else {
                    const element = shranjeno[0];
                    const id = element._id;
                    fetch(URL + `/prostor/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        }
                    }).then(response => {
                        setOpenNapaka(false);
                        setOpen(false);
                        if (response.status === 200) {
                            console.log(data);
                            setOpen(true);
                            response.json().then(data => {
                                console.log("status 200");
                                //localStorage.getItem("token");
                                setNaslovError(false);
                                setErrorMsgNaslov("");
                                setNazivError(false);
                                setErrorMsgNaziv("");
                                setStError(false);
                                setErrorMsgSt("");
                            }).catch(error => {
                                console.error('There was an error!', error);
                            });
                        } else {
                            setOpenNapaka(true);
                        }
                    }).catch(error => {
                        console.error('There was an error!', error);
                    });
                }
            }
        }).catch(error => {
            console.error('There was an error!', error);
        });
    
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLastnosti({ ...lastnosti, [e.target.name]: e.target.value });
    }

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

    return (
        <>
        <Helmet>
        <title>Vnos prostora in specifikacij</title>
      </Helmet>
            <Nav_organizator></Nav_organizator>

            <Box className="du_alert_success skrij" sx={{ width: '90%' }}>
                <Collapse in={open}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <FaTimes></FaTimes>
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Prostor je bil uspešno vnesen
                    </Alert>
                </Collapse>
            </Box>

            <Box className="du_alert_success skrij" sx={{ width: '90%' }}>
                <Collapse in={openNapaka}>
                    <Alert severity="error"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpenNapaka(false);
                                }}
                            >
                                <FaTimes></FaTimes>
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Pri vnašanju je prišlo do napake!
                    </Alert>
                </Collapse>
            </Box>

            <Box className="box-sirina_2 box-izgled" sx={{ flexGrow: 1 }}>
                <Grid container className='vsebina_forma_in_seznam' spacing={2}>
                    <Grid item className='vsebina-box' lg={12} xs={12}>
                        <h1>Vnesite podatke o prostoru</h1>
                        <Grid container>

                            <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                                <TextField error={nazivError} helperText={errorMsgNaziv}
                                    sx={{
                                        width: { xs: "auto" },
                                        input: {
                                          color: "#fff",
                                        },
                                      }}
                                      InputLabelProps={{
                                        style: { color: "#2e77ae" },
                                      }}
                                    id="text_field1" className='textField-dodajanjeUdelezenca skrij' label="Naziv prstora" fullWidth variant="filled"
                                    value={lastnosti.naziv} onChange={event => setLastnosti((prevState) => ({ ...prevState, ["naziv"]: event.target.value }))} />
                            </Grid>

                            <Grid item className='textField-zadeva' xs={12}>
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
                                    id="outlined-basic" className='skrij' label="Naslov stavbe" variant="filled"
                                    value={lastnosti.naslov} onChange={event => setLastnosti((prevState) => ({ ...prevState, ["naslov"]: event.target.value }))} />
                            </Grid>

                            <Grid item className='textField-zadeva' xs={12}>
                                <TextField type="number" error={stError} helperText={errorMsgSt}
                                    sx={{
                                        width: { xs: 220 },
                                        input: {
                                          color: "#fff",
                                        },
                                      }}
                                      InputLabelProps={{
                                        style: { color: "#2e77ae" },
                                      }}
                                      inputProps={{ min: 0, max: 1000 }}
                                    id="outlined-basic" className='skrij' label="Število sedežev" variant="filled"
                                    value={lastnosti.sedezi} onChange={event => setLastnosti((prevState) => ({ ...prevState, ["sedezi"]: parseInt(event.target.value) }))} />
                            </Grid>

                            <Grid item className='textField-zadeva skrij' xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Označite v primeru dostopnosti invalidnim osebam</FormLabel>
                                    <FormGroup aria-label="position" row>
                                        <FormControlLabel
                                            value="start"
                                            control={<Checkbox
                                                checked={lastnosti.dostopnost}
                                                onChange={event => setLastnosti((prevState) => ({ ...prevState, ["dostopnost"]: event.target.checked }))}
                                            />}
                                            label="Dostopno gibalno oviranim osebam"
                                            labelPlacement="start"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>

                            <Grid item className='textField-zadeva' xs={12}>
                                <Button variant="outlined" className='skrij' onClick={handleSubmit}>Vnesi</Button>
                            </Grid>



                        </Grid>

                    </Grid>
                </Grid>
            </Box>
            <Footer_organizator></Footer_organizator>
        </>
    );
}

export default Vnos_prostora_specifikacije;