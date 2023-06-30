import React, { useState, ChangeEvent, useEffect } from "react";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import auth from "../config/firebaseconfig";
import Nav_osnovni from "../komponente/Nav_osnovni";
import Footer_basic from "../komponente/Footer_basic";
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom"; //TO JE NAMESTO REDIRECT
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import '../Styles/prijava_uporabnik.css';
import { Helmet } from "react-helmet";

const Prijava_organizator: React.FC = () => {
  const URL = process.env.REACT_APP_URL;

  const [lastnosti, setLastnosti] = useState<{
    email: string;
    geslo: string;
    ime: string;
    priimek: string;
    token:string;
  }>({
    email: "",
    geslo: "",
    ime: "",
    priimek: "",
    token:""
  });
  const [repeatGeslo, setRepeatGeslo] = useState<string>("");
  const [errorMsgPassword, setErrorMsgPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [errorMsgIme, setErrorMsgIme] = useState<string>("");
  const [imeError, setImeError] = useState<boolean>(false);
  const [errorMsgPriimek, setErrorMsgPriimek] = useState<string>("");
  const [priimekError, setPriimekError] = useState<boolean>(false);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  if (loggedIn) {
    return <Navigate to="/" />;
  }
  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, lastnosti.email, lastnosti.geslo)
      .then((userCredential: UserCredential) => {
        const user = userCredential.user;
        console.log("registered:", user);

        user.getIdToken().then((token) => {
          const userData = {
            username: lastnosti.email,
            ime: lastnosti.ime,
            priimek: lastnosti.priimek,
            token: token,
          };
          console.log(token);
  
          fetch(URL+"/organizator/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Registration successful:", data);
              window.alert("Registering is successful!");
              setLoggedIn(true);
              window.sessionStorage.setItem("emailOrganizator",lastnosti.email)
              navigate('/organizator/konferenca');
            })
            .catch((error) => {
              console.error("Registration error:", error);
              if (error.code === "auth/email-already-in-use") {
                setEmailError(true);
                setErrorMsg("Email naslov je že v uporabi");
              }
            });
        });
      })
      .catch((error) => {
        console.error("Register error:", error);
        if (error.code === "auth/email-already-in-use") {
          setEmailError(true);
          setErrorMsg("Email naslov je že v uporabi");
        }
      });
  };
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLastnosti((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    setImeError(false);
    setErrorMsgIme("");
    setPriimekError(false);
    setErrorMsgPriimek("");
    setPasswordError(false);
    setErrorMsgPassword("");
    setEmailError(false);
    setErrorMsg("");

    if (!isValidEmail(lastnosti.email)) {
      setEmailError(true);
      setErrorMsg("Vnesite pravilen email naslov");
      return;
    }

    if (lastnosti.geslo !== repeatGeslo) {
      //window.alert("Passwords don't match!");
      setPasswordError(true);
      setErrorMsgPassword("Gesli se ne ujemata!");
      return;
    }

    if (lastnosti.geslo.length < 6) {
      setPasswordError(true);
      setErrorMsgPassword("Geslo mora vsebovati vsaj 6 znakov!");
      return;
    }

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

    setImeError(false);
    setErrorMsgIme("");
    setPriimekError(false);
    setErrorMsgPriimek("");
    setPasswordError(false);
    setErrorMsgPassword("");
    setEmailError(false);
    setErrorMsg("");

    handleRegister();
  };

  const isValidEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  };

  return (
    <>
    <Helmet>
        <title>Registracija - organizator</title>
      </Helmet>
      <Nav_osnovni />
      
      <Box className="box-sirina_2 box-izgled" sx={{ flexGrow: 1 }}>
            <Grid container className='vsebina_forma_in_seznam' spacing={2}>
              <Grid item className='vsebina-box' lg={12} xs={12}>
                <h1>Registrirajte se</h1>
                <Grid container>

                  <Grid item className='textField-dodajanjeUdelezenca' xs={12}>
                    <TextField error={emailError} helperText={errorMsg}
                      id="text_field1" className='textField-dodajanjeUdelezenca skrij'
                      sx={{
                        width: { xs: "auto" },
                        input: {
                          color: "#fff",
                        }
                      }}
                      InputLabelProps={{
                        style: { color: '#2e77ae' },
                      }} label="Email" fullWidth variant="filled"
                      value={lastnosti.email} onChange={event => setLastnosti((prevState) => ({ ...prevState, ["email"]: event.target.value }))} />
                  </Grid>

                  <Grid item className='textField-zadeva' xs={12}>
                    <TextField type="password" error={passwordError} helperText={errorMsgPassword}
                      id="outlined-basic" className='skrij'
                      sx={{
                        width: { xs: "auto" },
                        input: {
                          color: "#fff",
                        }
                      }}
                      InputLabelProps={{
                        style: { color: '#2e77ae' },
                      }} label="Geslo" variant="filled"
                      value={lastnosti.geslo} onChange={event => setLastnosti((prevState) => ({ ...prevState, ["geslo"]: event.target.value }))} />
                  </Grid>

                  <Grid item className='textField-zadeva' xs={12}>
                    <TextField type="password" error={passwordError} helperText={errorMsgPassword}
                      id="outlined-basic" className='skrij'
                      sx={{
                        width: { xs: "auto" },
                        input: {
                          color: "#fff",
                        }
                      }}
                      InputLabelProps={{
                        style: { color: '#2e77ae' },
                      }} label="Ponovi geslo" variant="filled"
                      value={repeatGeslo} onChange={event => setRepeatGeslo(event.target.value )} />
                  </Grid>

                  <Grid item className='textField-zadeva' xs={12}>
                    <TextField error={imeError} helperText={errorMsgIme}
                      id="outlined-basic" className='skrij'
                      sx={{
                        width: { xs: "auto" },
                        input: {
                          color: "#fff",
                        }
                      }}
                      InputLabelProps={{
                        style: { color: '#2e77ae' },
                      }} label="Ime" variant="filled"
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

                  <Grid item className='textField-zadeva' xs={12}>
                    <Button variant="outlined" className='skrij' onClick={handleSubmit}>Prijava</Button>
                  </Grid>



                </Grid>

              </Grid>
            </Grid>
          </Box>


      <Footer_basic />
    </>
  );
};
export default Prijava_organizator;
