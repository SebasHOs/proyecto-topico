import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9Ho9vmaCAJMVcgOsfiToxNEXLcQzswpo",
  authDomain: "proyecto-web-reportes.firebaseapp.com",
  databaseURL: "https://proyecto-web-reportes-default-rtdb.firebaseio.com",
  projectId: "proyecto-web-reportes",
  storageBucket: "proyecto-web-reportes.firebasestorage.app",
  messagingSenderId: "853031683883",
  appId: "1:853031683883:web:369839606f3a059e54a76e"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.firebaseAuth = {
    auth,
    db,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    doc,
    setDoc
};
