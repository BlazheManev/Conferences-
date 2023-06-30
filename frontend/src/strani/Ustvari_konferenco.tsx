import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ChangeEvent } from 'react';
import { Konferenca } from '../razredi/konferenca';
import Nav_organizator from '../komponente/Nav_organizator';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import '../Styles/prijava_organizator.css';
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import {
    FaTimes
} from "react-icons/fa";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Footer_organizator from '../komponente/Footer_organizator';
import TextField from '@mui/material/TextField';

interface DodajKonferencoProps {
    onAdd: (konferenca: Konferenca) => any;
}

const Ustvari_konferenco: React.FC<DodajKonferencoProps> = (props: DodajKonferencoProps) => {
    const URL = process.env.REACT_APP_URL;
    const [lastnosti, setLastnosti] = React.useState({
        naslov: "",
        datum: "",
        ura: ""
    });
    const [organizer, setOrganizer] = useState<boolean | null>(null);
    const [token, setToken] = useState<String>("null");
    const [open, setOpen] = React.useState(false);
    const [openNapaka, setOpenNapaka] = React.useState(false);
    const [naslovError, setNaslovError] = useState<boolean>(false);
    const [errorMsgNaslov, setErrorMsgNaslov] = useState<string>("");

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

            try {
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = () => {

        setNaslovError(false);
        setErrorMsgNaslov("");
        let data = {
            naslov: lastnosti.naslov,
            datum: lastnosti.datum,
            ura: lastnosti.ura
        }

        if (lastnosti.naslov == "") {
            setNaslovError(true);
            setErrorMsgNaslov("Vnesite naslov");
            return;
        }
        
        fetch(URL + "/konference", {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
              }
        }).then( async response => {
            const shranjeno = await response.json();
            console.log(data);
            console.log(shranjeno.length);

            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (shranjeno && shranjeno.message) || response.statusText;
                return Promise.reject(error);
            } else {
                if(shranjeno.length == 0) {
                    fetch(URL + "/konference", {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        }
                    }).then(async response => {
                        if (response.status === 200) {
                            console.log(JSON.stringify(data));
                            setOpenNapaka(true);
                            response.json().then(data => {
                                console.log("status 200");
                                //localStorage.getItem("token");
                                setNaslovError(false);
                                setErrorMsgNaslov("");
                            }).catch(error => {
                                console.error('There was an error!', error);
                            });
                        } else {
                            setOpen(true);
                        }
                    }).catch(error => {
                        console.error('There was an error!', error);
                    });
    
                } else {
                    const element = shranjeno[0];
                    console.log(element._id);
                    const id = element._id;
                    fetch(URL + `/konference/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        }
                    }).then(async response => {
                        if (response.status === 200) {
                            console.log(response);
                            response.json().then(data => {
                                console.log("status 200");
                            }).catch(error => {
                                console.error('There was an error!', error);
                            });
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
        <title>Ustvari konferenco</title>
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
                        Podatki so bili uspešno vneseni!
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
                        Pri vnašanju je prišlo do težave!
                    </Alert>
                </Collapse>
            </Box>

            <Box className="box-sirina_2 box-izgled box-padding-dodaten" sx={{ flexGrow: 1 }}>
                <Grid container className='vsebina_forma_in_seznam' spacing={2}>
                    <Grid item className='vsebina-box' lg={12} xs={12}>
                        <h1>Vnesite datum in naziv konference:</h1>
                        <Grid container>

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
                                    id="outlined-basic" className='skrij' label="Naslov konference" variant="filled"
                                    value={lastnosti.naslov} onChange={event => setLastnosti((prevState) => ({ ...prevState, ["naslov"]: event.target.value }))} />
                            </Grid>

                            <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                                <label htmlFor="datum">Datum: </label>
                                <input
                                    type="date"
                                    id="datum"
                                    name="datum"
                                    value={lastnosti.datum}
                                    onChange={event => setLastnosti({ ...lastnosti, [event.target.name]: event.target.value })}
                                    required
                                />
                            </Grid>

                            <Grid item className='textField-zadeva' xs={12}>
                                <Button variant="outlined" className='skrij' onClick={handleSubmit}>Ustvari</Button>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Box>
            <Footer_organizator></Footer_organizator>
        </>

    );
}

export default Ustvari_konferenco;