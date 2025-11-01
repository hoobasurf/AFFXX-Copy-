// firebase.js (100% compatible iPhone / Safari / Windows / Android)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

/* ---------- CONFIG ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyAbI0fvcv9lIzpPViVBx2BlO8c6L3w-rbc",
  authDomain: "affxx-copy.firebaseapp.com",
  databaseURL: "https://affxx-copy-default-rtdb.firebaseio.com",
  projectId: "affxx-copy",
  storageBucket: "affxx-copy.appspot.com",
  messagingSenderId: "763273288933",
  appId: "1:763273288933:web:d0083f5f6ab7284661c80c"
};

/* ---------- INITIALISATION ---------- */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ---------- PERSISTANCE ---------- */
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Persistance locale activée"))
  .catch(e => console.error("Erreur persistance:", e));

/* ---------- FONCTIONS ---------- */
async function forceLogoutAndClear() {
  try { await signOut(auth); } catch {}
  try {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    localStorage.clear();
    sessionStorage.clear();
  } catch {}
  console.log("🧹 Session Firebase nettoyée");
}

onAuthStateChanged(auth, (user) => {
  if (user) console.log("👤 Connecté:", user.email);
  else console.log("🚫 Déconnecté");
});

onIdTokenChanged(auth, async (user) => {
  if (!user) return;
  try { await user.getIdToken(true); } 
  catch { await signOut(auth); forceLogoutAndClear(); }
});

window.forceLogoutAndClear = forceLogoutAndClear;
export { app, auth, forceLogoutAndClear };
