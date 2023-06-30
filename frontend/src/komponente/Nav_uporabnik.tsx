import React, { useRef } from 'react';
import { FaBars, FaTimes, FaRegUserCircle } from "react-icons/fa";
import '../Styles/nav_home.css';
import CssBaseline from '@mui/material/CssBaseline';
import { signOut } from 'firebase/auth';
import auth from "../config/firebaseconfig";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

const Nav_uporabnik: React.FC = (props: any) => {
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const showNavbar = () => {
    if (navRef.current) {
        navRef.current.classList.toggle("responsive_nav");
        const elementi = document.getElementsByClassName("skrij");
        const element = document.getElementById('skrij');
        for (let i = 0; i < elementi.length; i++) {
            const el = elementi[i];
            el.classList.toggle("gumb-skrij");
        }
        console.log(element);
        element?.classList.toggle("gumb-skrij");
    }
};

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        window.sessionStorage.removeItem('auth'); 
        navigate('/');
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <>
      <CssBaseline />
      <div>
        <header>
          <h3>KONFERENCA</h3>
          <nav ref={navRef}>
            <a href="/konferenca">Konferenca</a>
            <a href="/QR-koda-scan">QR-bralnik</a>
            <a href="/prenos-gradiva">Gradivo</a>
            <a className='userIcon_a' href="/UrejenjeProfila">
              <FaRegUserCircle className='userIcon'/>
            </a>
            <button
              className="nav-btn nav-close-btn"
              onClick={showNavbar}>
              <FaTimes />
            </button>
            <Button sx={{
                        backgroundColor: "#ff8e2b"
                    }}
                     variant="contained" className="logout-btn" onClick={handleLogout}>
                        Odjava
                    </Button>
          </nav>
          <button
            className="nav-btn"
            onClick={showNavbar}>
            <FaBars />
          </button>
        </header>
      </div>
    </>
  );
}

export default Nav_uporabnik;
