import { Helmet } from 'react-helmet';
import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  UserCredential,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import auth from '../config/firebaseconfig';
import Nav_osnovni from '../komponente/Nav_osnovni';
import Footer_basic from '../komponente/Footer_basic';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import '../Styles/prijava_organizator.css';

const Prijava_organizator: React.FC = (props: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [errorMsgPassword, setErrorMsgPassword] = useState<string>("");
  const URL = process.env.REACT_APP_URL;

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

  const handleLogin = async () => {
    setPasswordError(false);
    setEmailError(false);
    setErrorMsgPassword("");
    setErrorMsg("");
    if (email == "" || password == "") {
      if (email == "") {
        //errors.email = 'Required'
        setEmailError(true);
        setErrorMsg("Vnesite pravilen email");
      }

      if (password == "") {
        //errors.email = 'Required'
        setPasswordError(true);
        setErrorMsgPassword("Vnesite pravilno geslo");
      }

    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmailError(true);
      setErrorMsg("Vnesite pravilen email");
    } else {
      try {
        const response = await fetch(URL + `/organizator/escape/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          // User exists
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential: UserCredential) => {
              const Organizator = userCredential.user;
              console.log('Logged in user:', Organizator);

              Organizator.getIdToken()
                .then((token) => {
                  fetch(URL + `/organizator/escape/${email}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                  })
                    .then((response) => response.json())
                    .then((updatedData) => {
                      console.log('Token updated:', updatedData);
                    })
                    .catch((error) => {
                      console.error('Token update error:', error);
                    });

                  window.sessionStorage.setItem('emailOrganizator', email);

                  setTimeout(() => {
                    navigate("/organizator/konferenca");
                  }, 2000);

                  setLoginError('');
                })
                .catch((error) => {
                  console.error('Token retrieval error:', error);
                });
            })
            .catch((error) => {
              console.error('Login error:', error);
              setLoginError('Nepravilen email ali geslo');
            });
        } else {
          // User doesn't exist
          setLoginError('Uporabnik ne obstaja, ali pa je registriran kot udeleženec');
        }
      } catch (error) {
        console.log(error);
        setLoginError('Pri prijavi je prišlo do napake');
      }
    }
  };


  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <>
      <Helmet>
        <title>Prijava - organizator</title>
      </Helmet>
      <Nav_osnovni />
      {loggedIn ? (
        <div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <div>

          <Box className="box-sirina_2 box-izgled" sx={{ flexGrow: 1 }}>
            <Grid container className='vsebina_forma_in_seznam' spacing={2}>
              <Grid item className='vsebina-box' lg={12} xs={12}>
                <h1>Prijavite se kot organizator</h1>
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
                      value={email} onChange={event => setEmail(event.target.value)} />
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
                      value={password} onChange={event => setPassword(event.target.value)} />
                  </Grid>

                  <Grid item className='textField-zadeva' xs={12}>
                    {loginError && <div className="error-message">{loginError}</div>}
                  </Grid>

                  <Grid item className='textField-zadeva' xs={12}>
                    <Button variant="outlined" className='skrij' onClick={handleLogin}>Prijava</Button>
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
          </Box>
        </div>
      )}
      <Footer_basic />
    </>
  );
};

export default Prijava_organizator;
