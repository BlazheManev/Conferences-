import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from "react-router-dom";
import Nav_organizator from '../komponente/Nav_organizator';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import '../Styles/pregled_organizator.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    FaTimes, FaWheelchair, FaMinus, FaUsers
} from "react-icons/fa";
import CountUp from 'react-countup';
import population_image from '../Styles/population_image.png';
import school_img from '../Styles/school_img.png';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Footer_organizator from '../komponente/Footer_organizator';

const Pregled_konference_organizator: React.FC = (props: any) => {
    const [seznamUporabnikov, setSeznamUporabnikov] = useState<any[]>([]);
    const [seznamUdelezencev, setSeznamUdelezencev] = useState<any[]>([]);
    const [organizer, setOrganizer] = useState<boolean | null>(null);
    const [token, setToken] = useState<String>("null");
    const [steviloUporabnikov, setSteviloUporabnikov] = useState<number>(0);
    const [steviloInvalidov, setSteviloInvalidov] = useState<number>(0);
    const [steviloUdelezencev, setSteviloUdelezencev] = useState<number>(0);
    const [urnik, setUrnik] = useState<Array<Razdelek>>([]);

    const navigate = useNavigate();

    const [konf, setKonf] = useState<{
        udelezenci: Array<any>;
        datum: string;
        zacetek: string;
        konec: string;
        naslov: string;
        imeSobe: string;
        sedezi: number;
        dostopnost: boolean;
    }>({
        udelezenci: [],
        datum: "",
        zacetek: "",
        konec: "",
        naslov: "",
        imeSobe: "",
        sedezi: 0,
        dostopnost: false,
    });

    interface Razdelek {
        ime: string;
        zacetek: string;
        konec: string;
        naslov: string;
        avtor: string;
    }

    const URL = process.env.REACT_APP_URL;

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
            await setToken(token);
            await setOrganizer(data.token);
            console.log(data.token);

            /////
            fetch(URL + '/konference', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(async response => {
                    const data = await response.json();
                    console.log(data);

                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response statusText
                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    } else {
                        let arrEmail = [];
                        let numberVseh = 0;
                        let numberInvalidov = 0;
                        let konferenca = data[data.length - 1];
                        console.log(konferenca);
                        if (konferenca === undefined) {
                            navigate('/organizator/upravljanje');
                            //window.location.reload();
                        } else {
                            konferenca.datum = konferenca.datum.split("T")[0];
                            let d = konferenca.datum.split("-")[2];
                            let m = konferenca.datum.split("-")[1];
                            let y = konferenca.datum.split("-")[0];
                            let datum = d + "." + m + "." + y;
                            konferenca.datum = datum;
                            setKonf((prevState) => ({ ...prevState, ["udelezenci"]: konferenca.Udelezenci }));
                            setKonf((prevState) => ({ ...prevState, ["datum"]: konferenca.datum }));
                            setKonf((prevState) => ({ ...prevState, ["zacetek"]: konferenca.zacetakUra }));
                            setKonf((prevState) => ({ ...prevState, ["konec"]: konferenca.konecUra }));
                            console.log(konferenca.timelines);
                            let times: Razdelek[] = [];
                            for (let i = 0; i < konferenca.timelines.length; i++) {
                                const element = konferenca.timelines[i];
                                const obj = {} as Razdelek;
                                if (element.gradiva === undefined || element.gradiva === null) {
                                    obj.avtor = "";
                                }else {
                                    if (element.gradiva.avtor === undefined || element.gradiva.avtor === null) {
                                        obj.avtor = "";
                                    }else {
                                        obj.avtor = element.gradiva.avtor.replace(/["']/g, "");
                                    }
                                }
                                obj.ime = element.ime;
                                obj.konec = element.konec;

                                if (element.gradiva === undefined || element.gradiva === null) {
                                    obj.naslov = "";
                                }else {
                                    if (element.gradiva.naslov === undefined || element.gradiva.naslov === null) {
                                        obj.naslov = "";
                                    }else {
                                        obj.naslov = element.gradiva.naslov.replace(/["']/g, "");
                                    }
                                }
                                obj.zacetek = element.zacetak;

                                console.log(obj);
                                times.push(obj);

                            }

                            setUrnik(times);
                        }

                    }
                })
                .catch(error => {

                    console.error('There was an error!', error);
                });

            ////

            fetch(URL + '/prostor', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(async response => {
                    const data = await response.json();
                    console.log(data);

                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response statusText
                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    } else {
                        let arrEmail = [];
                        let numberVseh = 0;
                        let numberInvalidov = 0;
                        let konferenca = data[data.length - 1];
                        if (konferenca === undefined) {
                            navigate('/organizator/upravljanje');
                            //window.location.reload();
                        } else {
                            console.log(konferenca);
                            setKonf((prevState) => ({ ...prevState, ["naslov"]: konferenca.naslov }));
                            setKonf((prevState) => ({ ...prevState, ["imeSobe"]: konferenca.naziv }));
                            setKonf((prevState) => ({ ...prevState, ["sedezi"]: konferenca.sedezi }));
                            setKonf((prevState) => ({ ...prevState, ["dostopnost"]: konferenca.dostopnost }));
                        }
                    }
                })
                .catch(error => {

                    console.error('There was an error!', error);
                });

            ///////

            fetch(URL + '/udelezenec', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
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
                        let arrEmail = [];
                        let numberVseh = 0;
                        let numberInvalidov = 0;

                        if (data === undefined) {
                            //navigate('/organizator/upravljanje');
                            //window.location.reload();
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                const element = data[i];

                                if (element.ime !== undefined && element.priimek !== undefined && element.gibalnaOvira !== undefined) {
                                    arrEmail.push(element);
                                    console.log(element.gibalnaOvira);
                                    numberVseh++;
                                    if (element.gibalnaOvira) {
                                        numberInvalidov++;
                                    }
                                }

                            }
                            setSteviloInvalidov(numberInvalidov);
                            setSteviloUporabnikov(numberVseh);
                            //setSeznamEmailov(arrEmail);
                            console.log(arrEmail);
                            setSeznamUporabnikov(arrEmail);
                        }
                    }
                })
                .catch(error => {

                    console.error('There was an error!', error);
                });

            ////////////

            fetch(URL + '/konference', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(async response => {
                    const data = await response.json();
                    console.log(data);

                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response statusText
                        const error = (data && data.message) || response.statusText;
                        return Promise.reject(error);
                    } else {
                        let arrEmail = [];
                        let numberVseh = 0;
                        let numberInvalidov = 0;
                        let konferenca = data[data.length - 1];
                        console.log(konferenca);
                        if (konferenca === undefined) {
                            navigate('/organizator/upravljanje');
                            //window.location.reload();
                        } else {
                            let arr_udelezenci = [];
                            let arr_email_udelezenci = konferenca.Udelezenci;



                            fetch(URL + '/udelezenec', {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`
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
                                        let arrEmail = [];
                                        let numberVseh = 0;
                                        let numberInvalidov = 0;

                                        if (data === undefined) {
                                            //navigate('/organizator/upravljanje');
                                            //window.location.reload();
                                        } else {
                                            for (let j = 0; j < arr_email_udelezenci.length; j++) {
                                                const element_email = arr_email_udelezenci[j];

                                                for (let i = 0; i < data.length; i++) {
                                                    const element = data[i];

                                                    if (element.username !== undefined && element.ime !== undefined && element.priimek !== undefined && element.gibalnaOvira !== undefined) {
                                                        if (element_email.email == element.username) {
                                                            arrEmail.push(element);
                                                            console.log(element.gibalnaOvira);
                                                            numberVseh++;
                                                        }
                                                    }

                                                }

                                            }
                                            setSteviloUdelezencev(numberVseh);
                                            //setSeznamEmailov(arrEmail);
                                            console.log(arrEmail);
                                            setSeznamUdelezencev(arrEmail);
                                        }
                                    }
                                })
                                .catch(error => {

                                    console.error('There was an error!', error);
                                });
                        }

                    }
                })
                .catch(error => {

                    console.error('There was an error!', error);
                });

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleOrganizer().catch(error => {
            console.error('There was an error!', error);
        });
        //pridobiVseUporabnike();
        //pridobiKonferenco();
        //pridobiProstor();
        //Runs on the first render
        //And any time any dependency value changes
    }, []);

    return (
        <>
            <Helmet>
                <title>Pregled konference</title>
            </Helmet>
            <Nav_organizator></Nav_organizator>

            <div className='pregled_lokacija'>
                <Box className="seznam_oblika" sx={{ flexGrow: 1 }}>
                    <Grid container className='' spacing={2}>
                        <Grid item className='' lg={12} xs={12}>
                            <h1 className='pregled_lastnosti_h1'>Pregled lastnosti konference</h1>
                            <Grid container>
                                <Grid item className='pregled_lokacija_vsebina' xs={12}>
                                    <Grid container>

                                        <Grid item className='pregled_center_school_img pregled_center_school_img_small' xs={12} sm={6} md={6}>
                                            <div>
                                                <img className='school_img' src={school_img} alt="konferenca podatki" />
                                            </div>
                                        </Grid>
                                        {konf.naslov ? <Grid item className='' xs={12} sm={6} md={6}>
                                            <Grid container>
                                                <Grid item className='pregled_counter_vsebina_vsi' xs={12} >
                                                    <div className='pregled_izpis_podatki'>
                                                        <p>Naslov:</p>
                                                        <h3 className='pregled_podatki_h3'>{konf.naslov}</h3>
                                                        <p>Naziv prostora:</p>
                                                        <h3 className='pregled_podatki_h3'>{konf.imeSobe}</h3>
                                                        <p>Število sedežev:</p>
                                                        <h3 className='pregled_podatki_h3'>{konf.sedezi}</h3>
                                                        <p>Dostopnost:</p>
                                                        <h3 className='pregled_podatki_h3'>{konf.dostopnost ? "Dostopno invalidnim osebam" : "Ni dostopno invalidnim osebam"}</h3>
                                                        <p>Datum:</p>
                                                        <h3 className='pregled_podatki_h3'>{konf.datum}</h3>
                                                        <p>Trajanje:</p>
                                                        <h3 className='pregled_podatki_h3'>{konf.zacetek} - {konf.konec}</h3>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Grid> :
                                        <Grid item className='' xs={12} sm={6} md={6}>
                                        <Grid container>
                                            <Grid item className='pregled_counter_vsebina_vsi' xs={12} >
                                                <div className='pregled_izpis_podatki'>
                                                    <h3 className='pregled_podatki_h3'>Konferenca ali prostor konference ni vnesen!</h3>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>}
                                        <Grid item className='pregled_center_school_img pregled_center_school_img_big' xs={12} sm={6} md={6}>
                                            <div>
                                                <img className='school_img' src={school_img} alt="konferenca podatki" />
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item className='' xs={12}>

                                </Grid>

                            </Grid>

                        </Grid>
                    </Grid>
                </Box>
            </div>

            <div className='pregled_seznam_vsebina'>
                <Box className="seznam_oblika" sx={{ flexGrow: 1 }}>
                    <Grid container className='' spacing={2}>
                        <Grid item className='' lg={12} xs={12}>
                            <h1>Pregled vseh prijavljenih uporabnikov</h1>
                            <Grid container>
                                <Grid item className='seznam_counter_vsebina' xs={12}>
                                    <Grid container>
                                        <Grid item className='' xs={12} sm={6}>
                                            <div>
                                                <img className='pop_img' src={population_image} alt="konferenca podatki" />
                                            </div>
                                        </Grid>

                                        <Grid item className='' xs={12} sm={6}>
                                            <Grid container>
                                                <Grid item className='pregled_counter_vsebina_vsi' xs={12} >
                                                    <FaUsers className='pregled_ikona_vsi' />
                                                    <h2 className='counter_h2_pregled'><CountUp end={steviloUporabnikov} /></h2>
                                                    <p>Število vseh prijavljenih uporabnikov</p>
                                                </Grid>

                                                <Grid item className='pregled_counter_vsebina_invalidi' xs={12} >
                                                    <FaWheelchair className='pregled_ikona_invalidi' />
                                                    <h2 className='counter_h2_pregled'><CountUp end={steviloInvalidov} /></h2>
                                                    <p>Število vseh invalidnih uporabnikov</p>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item className='' xs={12}>

                                </Grid>

                            </Grid>

                        </Grid>
                    </Grid>
                </Box>
            </div>

            <div className='pregled_urnik_div'>

                {urnik.length ? <VerticalTimeline>
                    {urnik.map((row) => (
                        <>
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                date={row.zacetek + " - " + row.konec}
                                dateClassName={"timeline_datum"}
                                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                            >
                                <h3 className="vertical-timeline-element-title">{row.ime}</h3>
                                <h4 className="vertical-timeline-element-subtitle">{row.naslov ? row.naslov : ""}</h4>
                                <p>
                                    {row.avtor ? row.avtor : ""}
                                </p>
                            </VerticalTimelineElement>
                        </>
                    ))}

                </VerticalTimeline> : 
                <h3>Urnik še ni vnesen!</h3>}

            </div>

            <div className='seznam_vsebina'>
                <Box className="seznam_oblika" sx={{ flexGrow: 1 }}>
                    <Grid container className='' spacing={2}>
                        <Grid item className='' lg={12} xs={12}>
                            <h1>Pregled vseh ki so se udeležili konference</h1>
                            <Grid container>
                                <Grid item className='seznam_counter_vsebina' xs={12}>
                                    <Grid container>
                                        <Grid item className='seznam_counter_vsebina_vsi' xs={12} sm={12}>
                                            <FaUsers className='seznam_ikona_vsi' />
                                            <h2 className='counter_h2_seznam'><CountUp end={steviloUdelezencev} /></h2>
                                            <p>Število vseh udeležencev</p>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item className='' xs={12}>

                                    {seznamUdelezencev.length ? <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 100, backgroundColor: '#193c5f', color: "#eee" }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: "#eee" }}><b>Ime</b></TableCell>
                                                    <TableCell sx={{ color: "#eee" }} ><b>Priimek</b></TableCell>
                                                    <TableCell sx={{ color: "#eee" }} ><b>Invalidnost</b></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {seznamUdelezencev.map((row) => (
                                                    <TableRow
                                                        key={row.ime}

                                                    >
                                                        <TableCell sx={{ color: "#eee" }} component="th" scope="row">
                                                            {row.ime == "" ? <FaMinus /> : row.ime}
                                                        </TableCell>
                                                        <TableCell sx={{ color: "#eee" }} >{row.priimek == "" ? <FaMinus /> : row.priimek}</TableCell>
                                                        <TableCell sx={{ color: "#eee" }}>{row.gibalnaOvira == true ? <FaWheelchair /> : <FaTimes />}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer> : 
                                    <div></div>}

                                </Grid>

                                <Grid item className='' xs={12}>

                                </Grid>

                            </Grid>

                        </Grid>
                    </Grid>
                </Box>
            </div>

            <Footer_organizator></Footer_organizator>
        </>
    );
}

export default Pregled_konference_organizator;
