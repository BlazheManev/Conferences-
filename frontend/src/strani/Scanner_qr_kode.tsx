import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import "../Styles/Scanner_qrKode.css";
import { useNavigate } from "react-router-dom";
import Nav_uporabnik from "../komponente/Nav_uporabnik";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import '../Styles/scanner_qr.css';
import Footer_uporabnik from '../komponente/Footer_uporabnik';
import { Helmet } from "react-helmet";

const Scanner_qrKode: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setShowScanner(true);
  };

  const handleDecode = (result: string) => {
    try {

      setTimeout(() => {
        window.location.href = result;
      }, 1000);
    } catch (error) {
      console.log("Invalid URL:", result);
    }
  };

  const handleError = (error: any) => {
    console.log(error?.message);
  };

  return (
    <>
    <Helmet>
        <title>Skeniraj QR-kodo</title>
      </Helmet>
      <Nav_uporabnik></Nav_uporabnik>
      <Box className="box-sirina_2 box-izgled box-padding-dodaten-scanner" sx={{ flexGrow: 1 }}>
        <Grid container className='vsebina_forma_in_seznam' spacing={2}>
          <Grid item className='vsebina-box' lg={12} xs={12}>
            <h1>Skeniranje QR-kode</h1>
            <Grid container>

              <Grid item className='textField-zadeva' xs={12}>
                {!showScanner && (
                  <Button variant="outlined" className='skrij' onClick={handleButtonClick}>Beri QR-kodo</Button>
                )}
              </Grid>

              <Grid item className='textField-vsebina' xs={12}>
                {showScanner && (
                  <div className="scanner-container skrij">
                    <QrScanner
                      onDecode={handleDecode}
                      onError={handleError}
                      //containerStyle={{ width: "100%", height: "100%" }}
                      videoStyle={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </Grid>

            </Grid>

          </Grid>
        </Grid>
      </Box>

      <Footer_uporabnik></Footer_uporabnik>
    </>
  );
};

export default Scanner_qrKode;
