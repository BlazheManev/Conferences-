import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Routes} from 'react-router-dom';     //TO JE NAMESTO SWITCH
import {Route} from 'react-router-dom';
import {Navigate} from 'react-router-dom';   //TO JE NAMESTO REDIRECT
import {BrowserRouter as Router} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import Osnovna from './strani/Osnovna';
import Prijava_uporabnik from './strani/Prijava_uporabnik';
import Registracija_uporabnik from './strani/Registracija_uporabnik';
import Prijava_organizator from './strani/Prijava_organizator';
import Ustvari_konferenco from './strani/Ustvari_konferenco';
import Vnos_prostora_specifikacije from './strani/Vnos_prostora_specifikacije';
import Dodajanje_udelezenca from './strani/Dodajanje_udelezenca';
import Obvestilo from './strani/Obvestilo';
import Urnik from './strani/Urnik';
import Lastnosti_udelezenci from './strani/Lastnosti_udelezenci';
import Pregled_konference_uporabnik from './strani/Pregled_konference_uporabnik';
import "./config/firebaseconfig";
import UrejenjeProfila from './strani/UrejenjeProfila';
import Nalaganje_gradiva from './strani/Nalaganje_gradiva';
import Prenos_gradiva from './strani/Prenos_gradiva';
import Pregled_konference_organizator from './strani/Pregled_konference_organizator';

import { Konferenca } from './razredi/konferenca';
import { Prostor } from './razredi/prostor';
import { Gradivo } from './razredi/gradivo';

import Registracija_organizator from './strani/Registracija_organizator';
import UdeleziSePage from './strani/UdeleziSe';
import Scanner_qrKode from './strani/Scanner_qr_kode';
import Generiranje_qr_kode from './strani/Generiranje_qr_kode';

function App() {

  const [seznamKonferenc, setSeznamKonferenc] = React.useState<Konferenca[]>([]);
  const [seznamProstorov, setSeznamP] = React.useState<Prostor[]>([]);
  const [seznamGradiv, setSeznamG] = React.useState<Gradivo[]>([]);

  const handleDodajKonferenco = (konf: Konferenca) => {
    let nov = Array.from(seznamKonferenc);
    nov.push(konf);
    setSeznamKonferenc(nov);
  }

  const handleDodajProstor = (prostor: Prostor) => {
    let nov = Array.from(seznamProstorov);
    nov.push(prostor);
    setSeznamP(nov);
  }

  const handleDodajGradivo = (gradivo: Gradivo) => {
    let nov = Array.from(seznamGradiv);
    nov.push(gradivo);
    setSeznamG(nov);
  }

  return (
    <Router>
      <Helmet><title>Sistem za konference</title></Helmet> 
      <div className = "App">
        <Routes>

          <Route path="/" element={<Osnovna></Osnovna>} />

          <Route path="/registracija" element={<Registracija_uporabnik></Registracija_uporabnik>} />

          <Route path="/prijava" element={<Prijava_uporabnik></Prijava_uporabnik>} />

          <Route path="/organizator-prijava" element={<Prijava_organizator></Prijava_organizator>} />

          <Route path="/organizator-registracija" element={<Registracija_organizator></Registracija_organizator>} />

          <Route path="/organizator/upravljanje" element={<Ustvari_konferenco onAdd={handleDodajKonferenco}/>} />

          <Route path="/organizator/konferenca" element={<Pregled_konference_organizator />} />

          <Route path="/organizator/prostor-in-vsebina" element={<Vnos_prostora_specifikacije onAdd={handleDodajProstor}/>} />

          <Route path="/organizator/gradivo" element={<Nalaganje_gradiva onAdd={handleDodajGradivo}/>} />

          <Route path="/organizator/dodaj-udelezenca" element={<Dodajanje_udelezenca></Dodajanje_udelezenca>} />

          <Route path="/organizator/obvestilo" element={<Obvestilo></Obvestilo>} />

          <Route path="/organizator/urnik" element={<Urnik></Urnik>} />

          <Route path="/organizator/lastnosti-in-udeleženci" element={<Lastnosti_udelezenci></Lastnosti_udelezenci>} />

          <Route path="/konferenca" element={<Pregled_konference_uporabnik></Pregled_konference_uporabnik>} />

          <Route path="/QR-koda" element={<Generiranje_qr_kode></Generiranje_qr_kode>} />

          <Route path="/QR-koda-scan" element={<Scanner_qrKode></Scanner_qrKode>} />

          <Route path="/UrejenjeProfila" element={<UrejenjeProfila></UrejenjeProfila>} />
          
          <Route path="/prenos-gradiva" element={<Prenos_gradiva></Prenos_gradiva>} />

          <Route path="/UdeleziSe/:_id" element={<UdeleziSePage />} />

          <Route path="/404" element={<h2>404 - Not found</h2>}/>

          <Route  path="*" element={<Navigate to="/404"/>} />


        </Routes>
      </div>
    </Router>

  );
}

export default App;
