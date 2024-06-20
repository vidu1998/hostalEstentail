// firebase config key setup
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig={
  apiKey: "AIzaSyC6PmnT2_QKv4Gl1xqMRKeYAGaV6FiMSV8",
  authDomain: "hostal-app-5aa90.firebaseapp.com",
  projectId: "hostal-app-5aa90",
  storageBucket: "hostal-app-5aa90.appspot.com",
  messagingSenderId: "984452009960",
  appId: "1:984452009960:web:1d32d6701f11fada05de5d"
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