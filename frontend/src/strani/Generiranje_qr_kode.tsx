import * as React from "react";
import { Helmet } from "react-helmet";
import QRCode from "qrcode.react";
import Nav_organizator from "../komponente/Nav_organizator";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import '../Styles/generiranje_qr.css';
import Footer_organizator from "../komponente/Footer_organizator";

const icon = require("../Styles/Feri_logo_bw.png");

const Generiranje_qr_kode: React.FC = () => {
  const [organizer, setOrganizer] = useState<boolean | null>(null);
  const [token, setToken] = useState<String>("null");
  const [fullscreen, setFullscreen] = useState<boolean>(true);
  const [urlQRCode, setQRCode] = useState<string>("null");
  const URL = process.env.REACT_APP_URL;
  const URL_FRONTEND = process.env.REACT_APP_URL_FRONTEND;
  const navigate = useNavigate();

  useEffect(() => {
    handleOrganizer().catch(error => {
      console.error('There was an error!', error);
  });
  }, []);

  const handleOrganizer = async () => {
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
      setToken(token);
      setOrganizer(data.token);

      try {
        const response = await fetch(`${URL}/konference/OnlyOne`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data._id) {
          setQRCode(URL_FRONTEND + `/UdeleziSe/${data._id}`);
        } else {
          setQRCode("");
        }
      } catch (error) {
        setQRCode("");
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

  const openFullscreen = () => {
    const element = document.getElementById("qrCodeElToRender");
    if (element) {
      if (element.requestFullscreen) {
          element.requestFullscreen().catch(error => {
            console.error('There was an error!', error);
        });
      }
      setFullscreen(true);
    }
  };

  const qrCode = urlQRCode ? (
    <QRCode
      id="qrCodeElToRender"
      size={500}
      value={urlQRCode}
      bgColor="white"
      fgColor="#141926"
      level="H"
      imageSettings={{
        src: icon,
        excavate: true,
        width: 500 * 0.1,
        height: 500 * 0.1,
      }}
    />
  ) : (
    <div className="qr-container__text">Konferenca ne obstaja,ustvarite Konferenco</div>
  );

  return (
    <>
      <Helmet>
        <title>QR koda</title>
      </Helmet>
      <Nav_organizator></Nav_organizator>
      <br />
      <div className="qr-container">
        <Box className="box-sirina_2 box-izgled box-padding-dodaten" sx={{ flexGrow: 1 }}>
          <Grid container className='vsebina_forma_in_seznam' spacing={2}>
            <Grid item className='vsebina-box' lg={12} xs={12}>
              <h1>QR-koda konference</h1>
              <Grid container>

                <Grid item className='textField-zadeva' xs={12}>
                  {qrCode}
                </Grid>

                <Grid item className='textField-vsebina' xs={12}>

                </Grid>

                <Grid item className='textField-zadeva' xs={12}>
                  <Button variant="outlined" className='skrij' onClick={openFullscreen}>Celozaslonski prikaz</Button>
                </Grid>

              </Grid>

            </Grid>
          </Grid>
        </Box>
      </div>
      <br />
      <Footer_organizator></Footer_organizator>
    </>
  );
};

export default Generiranje_qr_kode;
