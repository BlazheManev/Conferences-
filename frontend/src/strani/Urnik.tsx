import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Nav_organizator from '../komponente/Nav_organizator';
import Footer_basic from '../komponente/Footer_basic';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from "@mui/material/Button";
import '../Styles/urnik.css';
import {
  FaTimes
} from "react-icons/fa";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Footer_organizator from '../komponente/Footer_organizator';
interface Gradivo {
  _id: string;
  naslov: string;
  avtor: String;
}
interface Timeline {
  ime: string;
  zacetak: string;
  konec: string;
  gradiva: Gradivo | null;

}

const Urnik: React.FC = () => {
  const URL = process.env.REACT_APP_URL;

  const [conference, setConference] = useState({
    datum: '',
    zacetakUra: '09:00', // Default start time
    konecUra: '10:00', // Default end time
    timelines: [] as Timeline[],
  });
  const [organizer, setOrganizer] = useState<boolean | null>(null);
  const [token, setToken] = useState<String>("null");
  const [gradivaList, setGradivaList] = useState<Gradivo[]>([]);
  const [errorMsgNaziv, setErrorMsgNaziv] = useState<string>("");
  const [nazivError, setNazivError] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [openNapaka, setOpenNapaka] = React.useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    handleOrganizer().catch(error => {
      console.error('There was an error!', error);
  });
  }, []);

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

      fetch(URL + "/konference", {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
          }
      }).then( async response => {
        const shranjeno = await response.json();
        if (response.ok) {
          const dateOnly = shranjeno[0].datum.substring(0, 10); 

          setConference({
            ...conference, 
            datum: dateOnly,
          });
        }
       
      }).catch(error => {
        console.error('There was an error!', error);
    });

      try {
        const response = await fetch(`${URL}/gradivo/showGradiva`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setGradivaList(data);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (organizer === null) {
      return;
    }

    if (!organizer) {
      navigate("/");
    }
  }, [organizer, navigate]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedTimelines = [...conference.timelines];
      updatedTimelines[index] = {
        ...updatedTimelines[index],
        [name]: value,
      };
      const selectedGradivo = gradivaList.find((gradivo) => gradivo._id === value);
      updatedTimelines[index] = {
        ...updatedTimelines[index],
        [name]: value,
        gradiva: selectedGradivo || null,
      };
      setConference((prevConference) => ({
        ...prevConference,
        timelines: updatedTimelines,
      }));
    } else {
      if (name === 'datum') {
        const currentDate = new Date();
        const selectedDate = new Date(value);

        if (selectedDate < currentDate) {
          const formattedCurrentDate = currentDate.toISOString().split('T')[0];
          setConference((prevConference) => ({
            ...prevConference,
            [name]: formattedCurrentDate,
          }));
          return;
        }
      }

      setConference((prevConference) => ({
        ...prevConference,
        [name]: value,
      }));
    }
  };


  const handleAddTimeline = () => {
    const lastTimeline = conference.timelines[conference.timelines.length - 1];
    const zacetak = lastTimeline ? lastTimeline.konec : conference.zacetakUra;
    const konec = conference.konecUra;

    if (
      zacetak >= konec ||
      zacetak >= conference.konecUra ||
      konec <= conference.zacetakUra
    ) {
      return;
    }

    setConference((prevConference) => ({
      ...prevConference,
      timelines: [
        ...prevConference.timelines,
        {
          ime: '',
          zacetak,
          konec,
          gradiva: { _id: '', naslov: '', avtor: "" },
        },
      ],
    }));
  };



  const handleDeleteTimeline = (index: number) => {
    if (index === conference.timelines.length - 1) {
      setConference((prevConference) => {
        const updatedTimelines = [...prevConference.timelines];
        updatedTimelines.splice(index, 1);
        return {
          ...prevConference,
          timelines: updatedTimelines,
        };
      });
    }
  };

  const handleSaveConference = () => {
    if (
      conference.datum === '' ||
      conference.zacetakUra === '' ||
      conference.konecUra === '' ||
      conference.timelines.some((timeline) => timeline.ime === '')
    ) {
      return;
    }


    const requestBody = JSON.stringify({
      datum: conference.datum,
      zacetakUra: conference.zacetakUra,
      konecUra: conference.konecUra,
      timelines: conference.timelines,
    });

    fetch(URL + "/konference", {
      method: 'GET',
      headers: {
          Authorization: `Bearer ${token}`
        }
    }).then( async response => {
      const shranjeno = await response.json();

      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (shranjeno && shranjeno.message) || response.statusText;
        return Promise.reject(error);
      } else {
          if(shranjeno.length == 0) {
            fetch(URL + '/konference', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: requestBody,
            })
              .then((response) => response.json())
              .then((data) => {
                setOpen(true);
              })
              .catch((error) => {
                setOpenNapaka(false);
                console.error('Error:', error);
              });
          } else {
            const element = shranjeno[0];
            const id = element._id;
            const nas = element.naslov;

            const reqBody = JSON.stringify({
              naslov: nas,
              datum: conference.datum,
              zacetakUra: conference.zacetakUra,
              konecUra: conference.konecUra,
              timelines: conference.timelines,
            });

            fetch(URL + `/konference/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              }
            }).then ( async response => {
              fetch(URL + '/konference', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: reqBody,
              })
                .then((response) => response.json())
                .then((data) => {
                  setOpen(true);
                })
                .catch((error) => {
                  setOpenNapaka(false);
                  console.error('Error:', error);
                });
            }).catch(error => {
              console.error('There was an error!', error);
          });
              
          }
      }
    }).catch(error => {
      console.error('There was an error!', error);
  });

  };



  const lastTimeline = conference.timelines[conference.timelines.length - 1];
  const canAddTimeline =
    conference.timelines.every(
      (timeline) =>
        timeline.zacetak < conference.konecUra &&
        timeline.konec > conference.zacetakUra &&
        timeline.zacetak < timeline.konec
    ) &&
    conference.zacetakUra !== '' &&
    conference.konecUra !== '' &&
    conference.zacetakUra < conference.konecUra &&
    (!lastTimeline || (lastTimeline.konec < conference.konecUra && lastTimeline.zacetak < lastTimeline.konec));

  const canSaveConference =
    conference.datum !== '' &&
    conference.zacetakUra !== '' &&
    conference.konecUra !== '' &&
    conference.timelines.every((timeline) => timeline.ime !== '') &&
    conference.zacetakUra < conference.konecUra;


  return (
    <>
      <Helmet>
        <title>Urnik</title>
      </Helmet>
      <Nav_organizator />

      <Box className="du_alert_success" sx={{ width: '90%' }}>
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
                        Urnik je bil uspešno vnesen!
                    </Alert>
                </Collapse>
            </Box>

            <Box className="du_alert_success" sx={{ width: '90%' }}>
                <Collapse in={openNapaka}>
                    <Alert  severity="error"
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
                        Pri vnašanju urnika je prišlo do težave!
                    </Alert>
                </Collapse>
            </Box>

      <Box className="box-sirina_2 box-izgled" sx={{ flexGrow: 1 }}>
        <Grid container className='vsebina_forma_in_seznam' spacing={2}>
          <Grid item className='vsebina-box' lg={12} xs={12}>
            <h1>Ustvarite urnik/napovednik za konferenco</h1>
            <form>
              <Grid container>

                <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                  <label htmlFor="datum">Datum: </label>
                  <input
                    type="date"
                    id="datum"
                    name="datum"
                    value={conference.datum}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                  <label htmlFor="zacetakUra">Začetek konference: </label>
                  <input
                    type="time"
                    id="zacetakUra"
                    name="zacetakUra"
                    value={conference.zacetakUra}
                    onChange={handleInputChange}
                    disabled={conference.timelines.length > 0}
                    required
                  />
                </Grid>

                <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                  <label htmlFor="konecUra">Konec konference: </label>
                  <input
                    type="time"
                    id="konecUra"
                    name="konecUra"
                    value={conference.konecUra}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                  <h3>Dogodki:</h3>
                </Grid>

                {conference.timelines.map((timeline, index) => (
                  <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                    <div key={index}>
                      <Grid container>
                        <Grid item className='skrij' xs={12}>
                          <div>
                            <List>
                              <Divider sx={{
                                "&::before, &::after": {
                                  borderColor: "#2e77ae",
                                }, color: '#2e77ae',
                                width: "50%",
                                margin: "auto"
                              }}
                                textAlign="center"></Divider>
                            </List>
                          </div>
                        </Grid>
                        <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                          <h4>Dogodek {index + 1}</h4>
                        </Grid>
                        <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                          <label htmlFor={`ime-${index}`}>Naziv: </label>
                          <input
                            type="text"
                            id={`ime-${index}`}
                            className='urnik_ime'
                            name="ime"
                            value={timeline.ime}
                            onChange={(e) => handleInputChange(e, index)}
                            required
                          />
                        </Grid>

                        <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                          <label htmlFor={`zacetak-${index}`}>Začetek:</label>
                          <input
                            type="time"
                            id={`zacetak-${index}`}
                            className='urnik_dogodek_time'
                            name="zacetak"
                            value={timeline.zacetak}
                            onChange={(e) => handleInputChange(e, index)}
                            required
                            readOnly
                          />
                        </Grid>

                        <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                          <label htmlFor={`konec-${index}`}>Konec:</label>
                          <input
                            type="time"
                            id={`konec-${index}`}
                            className='urnik_dogodek_time'
                            name="konec"
                            value={timeline.konec}
                            onChange={(e) => handleInputChange(e, index)}
                            required
                            readOnly={index < conference.timelines.length - 1}

                          />
                        </Grid>

                        <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                          <label htmlFor={`gradivo-${index}`}>Gradivo:</label>
                          <select
                            id={`gradivo-${index}`}
                            name="gradivo"
                            className='urnik_gradivo'
                            value={timeline.gradiva ? timeline.gradiva._id : ''}
                            onChange={(e) => handleInputChange(e, index)}
                          >
                            <option value="">Izberi Gradivo</option>
                            {gradivaList.map((gradivo) => (
                              <option key={gradivo._id} value={gradivo._id}>
                                {gradivo.naslov}
                              </option>
                            ))}
                          </select>
                        </Grid>
                        {index === conference.timelines.length - 1 && (
                          <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                            <Button variant="outlined" className='skrij' onClick={() => handleDeleteTimeline(index)}>
                              Odstrani dogodek
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </div>
                  </Grid>
                ))}

                {canAddTimeline && (
                  <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                    <Button sx={{
                      "&.Mui-disabled": {
                        background: "rgb(211,211,211,0.3)"
                      }
                    }} variant="outlined" className='skrij' onClick={handleAddTimeline}
                      disabled={!canSaveConference}>Dodaj dogodek</Button>

                  </Grid>
                )}

                <Grid item className='skrij' xs={12}>
                  <div>
                    <List>
                      <Divider sx={{
                        "&::before, &::after": {
                          borderColor: "#2e77ae",
                        }, color: '#2e77ae',
                        margin: "auto"
                      }}
                        textAlign="center"></Divider>
                    </List>
                  </div>
                </Grid>

                <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                  <Button sx={{
                    "&.Mui-disabled": {
                      background: "rgb(211,211,211,0.3)"
                    }
                  }} variant="outlined" className='skrij'
                    onClick={handleSaveConference} disabled={!canSaveConference}>
                    Shrani Konferenco
                  </Button>
                </Grid>


              </Grid>
            </form>

          </Grid>
        </Grid>
      </Box>
      <Footer_organizator></Footer_organizator>
    </>
  );
};

export default Urnik;

