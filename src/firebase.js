import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const isDevMode = process.env.NODE_ENV === "development" && process.env.NODE_ENV !== "production"? true: false;

const config = {
  apiKey: isDevMode? "AIzaSyDCQDIBRksGAzpEvsczw86y5Hug30d9rFU" : "AIzaSyAtJhvTdDmVXFpipVzJ6Vk92xhtanQPR00",
  authDomain: isDevMode? "mm-happinessplanner.firebaseapp.com" : "the-happiness-planner.firebaseapp.com",
  databaseURL: isDevMode? "https://mm-happinessplanner.firebaseio.com" : "https://the-happiness-planner.firebaseio.com",
  projectId: isDevMode? "mm-happinessplanner" : "the-happiness-planner",
  storageBucket: isDevMode? "mm-happinessplanner.appspot.com" : "the-happiness-planner.appspot.com",
  messagingSenderId: isDevMode? "273001010214" : "1032654521320"
};

if (isDevMode) {
  console.log("🔥🔥🔥DEV MODE🔥🔥🔥");
}

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth();