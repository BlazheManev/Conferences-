import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged
} from "firebase/auth";
import auth from "../config/firebaseconfig";
import Nav_osnovni from "../komponente/Nav_osnovni";
import Footer_basic from "../komponente/Footer_basic";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Nav_uporabnik from "../komponente/Nav_uporabnik";
import { Helmet } from "react-helmet";
import Nav_organizator from "../komponente/Nav_organizator";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const UdeleziSePage: React.FC = () => {
  const { _id } = useParams<{ _id: string }>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [Errors, setErrors] = useState<string>(""); // Changed to lowercase 'string'
  const [Organizator, setOrganizator] = useState<boolean>();
  const [email, setUdelezenec] = useState<string>("null");
  const [Okay, setOkay] = useState<string>(""); // Changed to lowercase 'string'

  const URL = process.env.REACT_APP_URL;

  const navigate = useNavigate();




  const handleKonferenco = async () => {
    const token = window.sessionStorage.getItem("auth");
    try {
      if (token === null) {
        setErrors("Prosim se prijavite kot udelezencev");
      } else {
        const id = _id;
        const response = await fetch(`${URL}/konference/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (id !== data._id) {
          setErrors("Napačno Konferenco");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveData = async () => {
    const token = window.sessionStorage.getItem("auth");
    const id = _id;
    let isEmailExists = false;
    if (token === null) {
      setErrors("Prosim se prijavite kot udelezencev");
      const email = sessionStorage.getItem('emailOrganizator');
      if (email) {
        setOrganizator(true)
        return;
      }
      setOrganizator(false);
      setUdelezenec("null");
      return;
    }
    while (!isEmailExists) {
      const response = await fetch(`${URL}/konference/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Email is required") {
          setErrors(data.message);
          break; // Skip the loop if email is required
        }
        console.log(data)
        const existingEmail = data.Udelezenci.some(
          (udelezec: { email: string }) => udelezec.email === email
        );

        if (existingEmail) {
          setErrors("Že ste se prijavili na konferenco");
          break; // Skip the loop if email already exists
        }

        const putResponse = await fetch(`${URL}/konference/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        if (putResponse.ok) {
          console.log("Data saved successfully");

          try {
            const putData = await putResponse.json();
            console.log("Updated Konferenca:", putData);

            // Do something with the updated Konferenca data if needed

            setOkay("Ste prijavljeni na konferenco. Vas preusmerjam ...");

            setTimeout(() => {
              navigate("/konferenca");
            }, 2000);
            break; // Exit the loop after successful save
          } catch (error) {
            console.log("Error occurred:", error);
            setErrors("Error occurred while updating Konferenca");
          }
        } else {
          const putData = await putResponse.json();
          console.log("Error occurred:", putData.message);
          setErrors(putData.message);
        }
      } else {
        console.log("Error occurred:", data.message);
        setErrors(data.message);
      }

      // Add a delay before retrying the loop
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      handleKonferenco().catch(error => {
        console.error('There was an error!', error);
    });
      if (user) {
        setLoggedIn(true);
        if (user.email === null) {
        } else {
          setUdelezenec(user.email);
        }
      } else {
        setErrors("Prosim se prijavite kot Udelezencev");
        setLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (email !== null && email !== "null") {
      saveData().catch(error => {
        console.error('There was an error!', error);
    }); // Call the saveData method when the email is not null or not equal to "null"
    }
  }, [email]);

  return (
    <div>
      <Helmet>
        <title>Udeležitev</title>
      </Helmet>
      {loggedIn ? (
        <>{Organizator ? <Nav_organizator /> : <Nav_uporabnik />}</>
      ) : (
        <Nav_osnovni />
      )}

      <Box className="box-sirina_2 box-izgled" sx={{ flexGrow: 1 }}>
        <Grid container className='vsebina_forma_in_seznam' spacing={2}>
          <Grid item className='vsebina-box' lg={12} xs={12}>
            <h1>QR-koda konference</h1>
            <Grid container>

              <Grid item className='textField-zadeva' xs={12}>
                {Errors}
              </Grid>

              <Grid item className='textField-zadeva' xs={12}>
                {(() => {
                  if (Errors == "") {
                    return (
                      <div></div>
                    )
                  } else {
                    return (
                      <CircularProgress />
                    )
                  } 
                })()}
              </Grid>

              <Grid item className='textField-vsebina' xs={12}>
                {Okay}
              </Grid>

            </Grid>

          </Grid>
        </Grid>
      </Box>
      <Footer_basic />
    </div>
  );
};

export default UdeleziSePage;
