import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged
} from "firebase/auth";
import auth from "../config/firebaseconfig";
import Button from "@mui/material/Button";
import { Navigate, useNavigate } from "react-router-dom";
import Nav_uporabnik from "../komponente/Nav_uporabnik";
import Footer_uporabnik from "../komponente/Footer_uporabnik";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import { FaTimes } from "react-icons/fa";
import { Helmet } from "react-helmet";

const GoogleLoginInfo: React.FC = (props: any) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [errorMsgIme, setErrorMsgIme] = useState<string>("");
  const [imeError, setImeError] = useState<boolean>(false);
  const [errorMsgPriimek, setErrorMsgPriimek] = useState<string>("");
  const [priimekError, setPriimekError] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [openNapaka, setOpenNapaka] = React.useState(false);
  const URL = process.env.REACT_APP_URL;

  const [lastnosti, setLastnosti] = useState<{
    ime: string;
    priimek: string;
    gibalnaOvira: boolean;
  }>({
    ime: "",
    priimek: "",
    gibalnaOvira: false,
  });

  const [udelezenec, setOrganizer] = useState<boolean | null>(null);
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
      setOrganizer(data.token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (udelezenec === null) {
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    });


    if (udelezenec) {
      navigate("/");
    }
    return () => {
      unsubscribe();
    };
  }, [udelezenec, navigate]);

  const handleSubmit = () => {
    setOpen(false);
    setOpenNapaka(false);
    setImeError(false);
    setErrorMsgIme("");
    setPriimekError(false);
    setErrorMsgPriimek("");

    if (lastnosti.ime == "") {
      //window.alert("Passwords don't match!");
      setImeError(true);
      setErrorMsgIme("Vnesite ime!");
      return;
    }

    if (lastnosti.priimek == "") {
      //window.alert("Passwords don't match!");
      setPriimekError(true);
      setErrorMsgPriimek("Vnesite priimek!");
      return;
    }

    const userEmail = auth.currentUser?.email;

    const userData = {
      username: userEmail,
      ime: lastnosti.ime,
      priimek: lastnosti.priimek,
      gibalnaOvira: lastnosti.gibalnaOvira,
    };
    const token = window.sessionStorage.getItem('auth');

    fetch(URL + `/udelezenec/${userEmail}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`, // Include the token in the 'Authorization' header
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        setOpen(true);
        console.log("Data sent successfully:", data);
      })
      .catch((error) => {
        setOpenNapaka(true);
        console.error("Error sending data:", error);
      });
  };

  if (loggedIn) {
    console.log(loggedIn)
    return <Navigate to="/prijava" />;
  }

  return (
    <>
<Helmet>
        <title>Urejanje profila</title>
      </Helmet>
      <Nav_uporabnik></Nav_uporabnik>

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

      <div>
        <Box className="box-sirina_2 box-izgled box-padding-dodaten" sx={{ flexGrow: 1 }}>
          <Grid container className='vsebina_forma_in_seznam' spacing={2}>
            <Grid item className='vsebina-box' lg={12} xs={12}>
              <h1>Urejanje profila</h1>
              <Grid container>

                <Grid item className='textField-zadeva' xs={12}>
                  <TextField error={imeError} helperText={errorMsgIme}
                    sx={{
                      width: { xs: "auto" },
                      input: {
                        color: "#fff",
                      }
                    }}
                    InputLabelProps={{
                      style: { color: '#2e77ae' },
                    }}
                    id="outlined-basic" className='skrij' label="Ime" variant="filled"
                    value={lastnosti.ime} onChange={event => setLastnosti((prevState) => ({ ...prevState, ["ime"]: event.target.value }))} />
                </Grid>

                <Grid item className='textField-zadeva' xs={12}>
                  <TextField error={priimekError} helperText={errorMsgPriimek}
                    id="outlined-basic" className='skrij'
                    sx={{
                      width: { xs: "auto" },
                      input: {
                        color: "#fff",
                      }
                    }}
                    InputLabelProps={{
                      style: { color: '#2e77ae' },
                    }} label="Priimek" variant="filled"
                    value={lastnosti.priimek} onChange={event => setLastnosti((prevState) => ({ ...prevState, ["priimek"]: event.target.value }))} />
                </Grid>

                <Grid item className='textField-zadeva skrij' xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Označite v primeru invalidnosti</FormLabel>
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        value="start"
                        control={<Checkbox
                          checked={lastnosti.gibalnaOvira}
                          onChange={event => setLastnosti((prevState) => ({ ...prevState, ["gibalnaOvira"]: event.target.checked }))}
                        />}
                        label="Gibalna oviranost"
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
      </div>
      <Footer_uporabnik></Footer_uporabnik>
    </>
  );
};

export default GoogleLoginInfo;


