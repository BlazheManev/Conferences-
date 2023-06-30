// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const API_KEY = process.env.REACT_APP_API_KEY_FIREBASE;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "fir-strokovne-konference.firebaseapp.com",
  projectId: "fir-strokovne-konference",
  storageBucket: "fir-strokovne-konference.appspot.com",
  messagingSenderId: "382854927635",
  appId: "1:382854927635:web:160663efa64625236076e6",
  measurementId: "G-H47DQN08GG"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);
const auth = getAuth(firebase);

export default auth;
