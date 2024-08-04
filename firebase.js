// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";import {getFirestore, getfirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDean0rmbihnKUNcJQWerxdhorkxh2OGIs",
  authDomain: "pantry-tracker-2acee.firebaseapp.com",
  projectId: "pantry-tracker-2acee",
  storageBucket: "pantry-tracker-2acee.appspot.com",
  messagingSenderId: "715948148840",
  appId: "1:715948148840:web:a26607e4426471d9cb53dd",
  measurementId: "G-0T44WTHQ21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app)

export{firestore}