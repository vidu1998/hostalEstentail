// firebase config key setup
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig={
    apiKey: "AIzaSyDkUyayB4IELPXtUeCqkY5dRPiND9RjnZE",
    authDomain: "hostal-636e6.firebaseapp.com",
    projectId: "hostal-636e6",
    storageBucket: "hostal-636e6.appspot.com",
    messagingSenderId: "275298872523",
    appId: "1:275298872523:web:dc0cef6f7ade221e083f4e",
    measurementId: "G-EMDTF10MZE"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  const db = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);
  
  // Enable experimentalForceLongPolling for Firestore
  const firestoreConfig = {
    experimentalForceLongPolling: true,
  };
  const firestore = firebase.firestore(firebase.app());
  firestore.settings(firestoreConfig);
  

  export { firebase, db };