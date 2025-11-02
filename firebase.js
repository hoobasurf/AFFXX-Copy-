// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAbI0fvcv9lIzpPViVBx2BlO8c6L3w-rbc",
  authDomain: "affxx-copy.firebaseapp.com",
  databaseURL: "https://affxx-copy-default-rtdb.firebaseio.com",
  projectId: "affxx-copy",
  storageBucket: "affxx-copy.appspot.com",
  messagingSenderId: "763273288933",
  appId: "1:763273288933:web:d0083f5f6ab7284661c80c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Session Firebase persistée localement"))
  .catch(e => console.error("Erreur persistance :", e));

function clearLocalSession() {
  try {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    localStorage.clear();
    console.log("🧹 Cache Firebase local supprimé");
  } catch (e) { console.warn("Erreur suppression cache :", e); }
}

async function forceLogoutAndClear() {
  try { await signOut(auth); } catch (e) {}
  clearLocalSession();
  try { window.location.reload(); } catch {}
}

onAuthStateChanged(auth, (user) => {
  if (user) console.log("👤 Utilisateur connecté :", user.email ?? user.uid);
});

onIdTokenChanged(auth, async (user) => {
  if (!user) return;
  try { await user.getIdToken(true); }
  catch (e) { 
    try { await signOut(auth); } catch {}
    clearLocalSession();
  }
});

window.forceLogoutAndClear = forceLogoutAndClear;
window.clearLocalSession = clearLocalSession;

export { app, auth, clearLocalSession, forceLogoutAndClear };
