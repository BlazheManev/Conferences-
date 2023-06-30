import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Nav_organizator from '../komponente/Nav_organizator';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import '../Styles/lastnosti_udelezenci.css';
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
import { useNavigate } from 'react-router-dom';
import Footer_organizator from '../komponente/Footer_organizator';

const Lastnosti_udelezenci: React.FC = (props: any) => {
    const [seznamUporabnikov, setSeznamUporabnikov] = useState<any[]>([]);
    const [steviloUporabnikov, setSteviloUporabnikov] = useState<number>(0);
    const [steviloInvalidov, setSteviloInvalidov] = useState<number>(0);
    const URL = process.env.REACT_APP_URL;
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
          console.log(data)

          const token = data.token;
          setToken(token)
          setOrganizer(data.token);
          fetch(URL + '/udelezenec',{
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
                  let arrEmail = [];
                  let numberVseh = 0;
                  let numberInvalidov = 0;
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
          })
          .catch(error => {

              console.error('There was an error!', error);
          });
       
        } catch (error) {
          console.log(error);
        }
      };



    return (
        <>
        <Helmet>
            <title>Prijavljeni uporabniki</title>
        </Helmet>
            <Nav_organizator></Nav_organizator>

            <div className='seznam_vsebina'>
                <Box className="seznam_oblika" sx={{ flexGrow: 1 }}>
                    <Grid container className='' spacing={2}>
                        <Grid item className='' lg={12} xs={12}>
                            <h1>Pregled vseh prijavljenih uporabnikov</h1>
                            <Grid container>
                                <Grid item className='seznam_counter_vsebina' xs={12}>
                                    <Grid container>
                                        <Grid item className='seznam_counter_vsebina_vsi' xs={12} sm={6}>
                                            <FaUsers className='seznam_ikona_vsi' />
                                            <h2 className='counter_h2_seznam'><CountUp end={steviloUporabnikov} /></h2>
                                            <p>Število vseh udeležencev</p>
                                        </Grid>

                                        <Grid item className='seznam_counter_vsebina_invalidi' xs={12} sm={6}>
                                            <FaWheelchair className='seznam_ikona_invalidi' />
                                            <h2 className='counter_h2_seznam'><CountUp end={steviloInvalidov} /></h2>
                                            <p>Število vseh invalidnih udeležencev</p>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item className='' xs={12}>

                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 100, backgroundColor: '#193c5f', color: "#eee" }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: "#eee" }}><b>Ime</b></TableCell>
                                                    <TableCell sx={{ color: "#eee" }} ><b>Priimek</b></TableCell>
                                                    <TableCell sx={{ color: "#eee" }} ><b>Invalidnost</b></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {seznamUporabnikov.map((row) => (
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
                                    </TableContainer>

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

export default Lastnosti_udelezenci;
