import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Nav_organizator from '../komponente/Nav_organizator';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import '../Styles/obvestilo.css';
import {
    FaTimes
} from "react-icons/fa";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from 'react-router-dom';
import Footer_organizator from '../komponente/Footer_organizator';


const Obvestilo: React.FC = (props: any) => {

    const [seznamEmailov, setSeznamEmailov] = useState<string[]>([]);
    const [zadeva, setZadeva] = useState<string>("");
    const [vsebina, setVsebina] = useState<string>("");
    const [zadevaError, setZadevaError] = useState<boolean>(false);
    const [errorMsgZadeva, setErrorMsgZadeva] = useState<string>("");
    const [vsebinaError, setVsebinaError] = useState<boolean>(false);
    const [errorMsgVsebina, setErrorMsgVsebina] = useState<string>("");
    const [open, setOpen] = React.useState(false);
    const [openNapaka, setOpenNapaka] = React.useState(false);
    const [organizer, setOrganizer] = useState<boolean | null>(null);
    const [token, setToken] = useState<String>("null");
    const URL = process.env.REACT_APP_URL;
    const navigate = useNavigate();

    const addEmail = (item: string) => {
        setSeznamEmailov([...seznamEmailov, item]);
    };

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


            //////////
            fetch(URL + '/udelezenec', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(async response => {
                    const data = await response.json();

                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response statusText
                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    } else {
                        let arrEmail = [];
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];

                            if (element.username !== undefined) {
                                arrEmail.push(element.username);
                                console.log(element.username);
                            }

                        }
                        setSeznamEmailov(arrEmail);
                        console.log(arrEmail);
                    }
                })
                .catch(error => {

                    console.error('There was an error!', error);
                });

        } catch (error) {
            console.log(error);
        }
    };

    function pridobiVseEmail() {
        fetch(URL + '/udelezenec', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response statusText
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                } else {
                    let arrEmail = [];
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];

                        if (element.username !== undefined) {
                            arrEmail.push(element.username);
                            console.log(element.username);
                        }

                    }
                    setSeznamEmailov(arrEmail);
                    console.log(arrEmail);
                }
            })
            .catch(error => {

                console.error('There was an error!', error);
            });
    }

    function handleClickPosljiEmail() {
        setZadevaError(false);
        setVsebinaError(false);
        setErrorMsgVsebina("");
        setErrorMsgZadeva("");
        if (zadeva == "" || vsebina == "") {
            if (zadeva == "") {
                setZadevaError(true);
                setErrorMsgZadeva("Vnesite zadevo!");
            }
            if (vsebina == "") {
                setVsebinaError(true);
                setErrorMsgVsebina("Vnesite vsebino!");
            }
        } else {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ to: seznamEmailov.toString(), subject: zadeva, text: vsebina })
            };
            fetch(URL + '/mail/', requestOptions)
                .then(async response => {
                    const isJson = response.headers.get('content-type')?.includes('application/json');
                    const data = isJson && await response.json();

                    // check for error response
                    if (!response.ok) {
                        setOpenNapaka(true);
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    } else {
                        setZadeva("");
                        setVsebina("");
                        setOpen(true);
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    useEffect(() => {
        handleOrganizer().catch(error => {
            console.error('There was an error!', error);
        });
        //Runs on the first render
        //And any time any dependency value changes
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
        <title>Pošlji obvestilo</title>
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
                        Vabila so bila uspešno poslana!
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
                        Pri pošiljanju je prišlo do napake!
                    </Alert>
                </Collapse>
            </Box>

            <Box className="box-sirina_2 box-izgled" sx={{ flexGrow: 1 }}>
                <Grid container className='vsebina_forma_in_seznam' spacing={2}>
                    <Grid item className='vsebina-box' lg={12} xs={12}>
                        <h1>Obvesti udeležence konference</h1>
                        <Grid container>

                            <Grid item className='textField-zadeva' xs={12}>
                                <TextField error={zadevaError} helperText={errorMsgZadeva}
                                    id="outlined-basic" className='skrij'
                                    sx={{
                                        width: { xs: "auto" },
                                        input: {
                                          color: "#fff",
                                        }
                                      }}
                                      InputLabelProps={{
                                        style: { color: '#2e77ae' },
                                      }} label="Zadeva" variant="filled"
                                    value={zadeva} onChange={event => setZadeva(event.target.value)} />
                            </Grid>

                            <Grid item className='textField-vsebina' xs={12}>
                                <TextField error={vsebinaError} helperText={errorMsgVsebina}
                                sx={{
                                    width: { xs: 220, sm: 360, md: 600 },
                                    input: {
                                      color: "#fff",
                                    }
                                  }}
                                  InputLabelProps={{
                                    style: { color: '#2e77ae' },
                                  }}
                                    placeholder="Napišite vsebino vabila"
                                    multiline
                                    rows={4}
                                    maxRows={Infinity}
                                    id="outlined-basic_nekaj" className='skrij' label="Vsebina" variant="filled"
                                    value={vsebina} onChange={event => setVsebina(event.target.value)}
                                />
                            </Grid>

                            <Grid item className='textField-zadeva' xs={12}>
                                <Button variant="outlined" className='skrij' onClick={handleClickPosljiEmail}>Pošlji obvestilo</Button>
                            </Grid>

                        </Grid>

                    </Grid>
                </Grid>
            </Box>

            <Footer_organizator></Footer_organizator>
        </>
    );
}

export default Obvestilo;
