import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAbI0fvcv9lIzpPViVBx2BlO8c6L3w-rbc",
  authDomain: "affxx-copy.firebaseapp.com",
  databaseURL: "https://affxx-copy-default-rtdb.firebaseio.com",
  projectId: "affxx-copy",
  storageBucket: "affxx-copy.appspot.com",
  messagingSenderId: "763273288933",
  appId: "1:763273288933:web:d0083f5f6ab7284661c80c"
};

// Initialisation
const app = initializeApp(firebaseConfig);

// 🔹 Persistance locale de la session
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Persistance activée (session locale)"))
  .catch(err => console.error("Erreur persistance :", err));

export { app, auth };
