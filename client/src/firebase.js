import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHRD-IfKsQpouSMLkN_hTb88CPfUzOtJ8",
  authDomain: "teams-clone-92780.firebaseapp.com",
  projectId: "teams-clone-92780",
  storageBucket: "teams-clone-92780.appspot.com",
  messagingSenderId: "48597175720",
  appId: "1:48597175720:web:8ebe49ba3d95d35e17619d",
  measurementId: "G-JD3XDNJTJ6"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
