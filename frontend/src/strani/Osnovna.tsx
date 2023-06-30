import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Nav_home from "../komponente/Nav_home";
import Footer_basic from "../komponente/Footer_basic";
import Nav_uporabnik from "../komponente/Nav_uporabnik";
import { onAuthStateChanged } from "firebase/auth";
import auth from "../config/firebaseconfig";
import Nav_organizator from "../komponente/Nav_organizator";

const Osnovna: React.FC = (props: any) => {
  const URL = process.env.REACT_APP_URL;
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [Organizator, setOrganizator] = useState<boolean>();

  const handleOrganizator = async () => {
    const email = sessionStorage.getItem("emailOrganizator");
    console.log(email);
    if (email != null) {
      try {
        const response = await fetch(
          URL+"/organizator/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        const data = await response.json();
        const token = data.token;

        setOrganizator(true);
        console.log(Organizator);
        console.log(data);
        setOrganizator(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      handleOrganizator().catch(error => {
        console.error('There was an error!', error);
    });
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

  return (
    <>
      <Helmet>
        <title>Konferenca</title>
      </Helmet>
      {loggedIn ? (
        <>{Organizator ? <Nav_organizator /> : <Nav_uporabnik />}</>
      ) : (
        <Nav_home />
      )}
      <Footer_basic />
    </>
  );
};

export default Osnovna;
