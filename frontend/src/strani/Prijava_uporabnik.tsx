import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  UserCredential,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import auth from "../config/firebaseconfig";
import Nav_osnovni from "../komponente/Nav_osnovni";
import Footer_basic from "../komponente/Footer_basic";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import "../Styles/prijava_uporabnik.css";
import { Divider, List } from "@mui/material";
import { FaGoogle } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Prijava_uporabnik: React.FC = (props: any) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [Organizator, setOrganizator] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [errorMsgPassword, setErrorMsgPassword] = useState<string>("");

  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL;

  useEffect(() => {
    handleOrganizator().catch(error => {
      console.error('There was an error!', error);
  });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (Organizator === true && user) {
        navigate("/");
      } else if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [Organizator, navigate]);

  const handleOrganizator = async () => {
    const email = sessionStorage.getItem("emailOrganizator");
    try {
      const response = await fetch(URL + "/organizator/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      const token = data.token;

      setOrganizator(true);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

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
        const response = await fetch(URL + `/udelezenec/escape/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential: UserCredential) => {
              const user = userCredential.user;
              console.log("Logged in user:");
              user.getIdToken().then((token) => {
                window.sessionStorage.setItem("auth", token);
              });
              setLoginError("");
              navigate("/konferenca");
            })
            .catch((error) => {
              console.error("Login error:", error);
              setLoginError("Nepravilen email ali geslo");
            });
        } else {
          // User doesn't exist
          setLoginError(
            "Uporabnik ne obstaja, ali pa je registriran kot Organizator"
          );
        }
      } catch (error) {
        console.log(error);
        setLoginError("Pri prijavi je prišlo do napake");
      }
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Logged in with Google:", user);

        user.getIdToken().then((token) => {
          window.sessionStorage.setItem("auth", token);
        });

        const userData = {
          username: user.email,
          ime: "",
          priimek: "",
          gibalnaOvira: false,
        };
        const token = window.sessionStorage.getItem("auth");
        console.log(token);
        fetch(URL + "/udelezenec/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
          },
          body: JSON.stringify(userData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Registration successful:", data);
            navigate("/UrejenjeProfila");
          })
          .catch((error) => {
            console.error("Registration error:", error);
          });
      })
      .catch((error) => {
        console.error("Google login error:", error);
        setLoginError("Google login failed");
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        window.sessionStorage.removeItem("auth");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <>
      <Helmet>
        <title>Prijava</title>
      </Helmet>
      <Nav_osnovni />
      {loggedIn ? (
        <div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <div>
          <Box className="box-sirina_2 box-izgled" sx={{ flexGrow: 1 }}>
            <Grid container className="vsebina_forma_in_seznam" spacing={2}>
              <Grid item className="vsebina-box" lg={12} xs={12}>
                <h1>Prijavite se v konferenco</h1>
                <Grid container>
                  <Grid item className="textField-dodajanjeUdelezenca" xs={12}>
                    <TextField
                      error={emailError}
                      helperText={errorMsg}
                      id="text_field1"
                      className="textField-dodajanjeUdelezenca skrij"
                      sx={{
                        width: { xs: "auto" },
                        input: {
                          color: "#fff",
                        },
                      }}
                      InputLabelProps={{
                        style: { color: "#2e77ae" },
                      }}
                      label="Email"
                      fullWidth
                      variant="filled"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </Grid>

                  <Grid item className="textField-zadeva" xs={12}>
                    <TextField
                      type="password"
                      error={passwordError}
                      helperText={errorMsgPassword}
                      id="outlined-basic"
                      className="skrij"
                      sx={{
                        width: { xs: "auto" },
                        input: {
                          color: "#fff",
                        },
                      }}
                      InputLabelProps={{
                        style: { color: "#2e77ae" },
                      }}
                      label="Geslo"
                      variant="filled"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </Grid>

                  <Grid item className="textField-zadeva" xs={12}>
                    {loginError && (
                      <div className="error-message">{loginError}</div>
                    )}
                  </Grid>

                  <Grid item className="textField-zadeva" xs={12}>
                    <Button
                      variant="outlined"
                      className="skrij"
                      onClick={handleLogin}
                    >
                      Prijava
                    </Button>
                  </Grid>

                  <Grid item className="skrij" xs={12}>
                    <div>
                      <List>
                        <Divider
                          sx={{
                            "&::before, &::after": {
                              borderColor: "#2e77ae",
                            },
                            color: "#2e77ae",
                          }}
                          textAlign="center"
                        >
                          Ali pa se prijavi z Google
                        </Divider>
                      </List>
                    </div>
                  </Grid>

                  <Grid item className="google_prijava_padding" xs={12}>
                    <Button
                      variant="outlined"
                      className="skrij"
                      onClick={handleGoogleLogin}
                    >
                      <FaGoogle /> &nbsp;&nbsp;Prijava z Google
                    </Button>
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

export default Prijava_uporabnik;
