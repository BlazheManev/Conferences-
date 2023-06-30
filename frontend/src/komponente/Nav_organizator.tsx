import React, { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../Styles/nav_home.css";
import CssBaseline from "@mui/material/CssBaseline";
import { signOut } from "firebase/auth";
import auth from "../config/firebaseconfig";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

const Nav_organizator: React.FC = (props: any) => {
    const navRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const URL = process.env.REACT_APP_URL;

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
        const email = sessionStorage.getItem("emailOrganizator");
        console.log(email)
        // Send request to backend to delete the token
        fetch(URL + `/organizator/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: `${email}` }), // Set the token value to null
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Token deleted:", data);
                window.sessionStorage.removeItem("emailOrganizator");
                navigate("/");
            })
            .catch((error) => {
                console.error("Token deletion error:", error);
            });
        signOut(auth)
            .then(() => {
                console.log("User signed out");
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
                        <a href="/organizator/konferenca">Konferenca</a>
                        <a href="/organizator/prostor-in-vsebina">Prostor in vsebine</a>
                        <a href="/organizator/dodaj-udelezenca">Povabilo</a>
                        <a href="/organizator/obvestilo">Obvesti</a>
                        <a href="/organizator/urnik">Urnik</a>
                        <a href="/organizator/gradivo">Gradivo</a>
                        <a href="/organizator/lastnosti-in-udeleženci">
                            Seznam udeležencev
                        </a>
                        <a href="/QR-koda">
                            QR-koda
                        </a>
                        <a href="/organizator/upravljanje">Upravljaj</a>
                        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                            <FaTimes />
                        </button>
                    </nav>
                    <button className="nav-btn" onClick={showNavbar}>
                        <FaBars />
                    </button>
                    <Button sx={{
                        backgroundColor: "#ff8e2b"
                    }}
                     variant="contained" className="logout-btn skrij" onClick={handleLogout}>
                        Odjava
                    </Button>
                </header>
            </div>
        </>
    );
};

export default Nav_organizator;
