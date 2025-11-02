// firebase.js (version modulaire 2025 - stable et compatible mobile)

import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  signOut, 
  onAuthStateChanged, 
  onIdTokenChanged 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { 
  getDatabase 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

import { 
  getStorage 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

/* ---------- CONFIGURATION FIREBASE ---------- */
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
const db = getDatabase(app);
const storage = getStorage(app);

/* ---------- PERSISTANCE (iPhone / Safari / Android / Windows) ---------- */
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Session Firebase persistée localement"))
  .catch(e => console.warn("⚠️ Erreur persistance :", e));

/* ---------- NETTOYAGE LOCAL ---------- */
function clearLocalSession() {
  try {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    localStorage.clear();
    sessionStorage.clear();
    console.log("🧹 Cache local Firebase supprimé");
  } catch (e) {
    console.warn("Erreur suppression cache :", e);
  }
}

/* ---------- DÉCONNEXION COMPLÈTE ---------- */
async function forceLogoutAndClear() {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn("Erreur déconnexion :", e);
  }
  clearLocalSession();
  try { window.location.reload(); } catch {}
}

/* ---------- SUIVI DE SESSION ---------- */
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("👤 Connecté :", user.email ?? user.uid);
  } else {
    console.log("🚫 Aucun utilisateur connecté");
  }
});

onIdTokenChanged(auth, async (user) => {
  if (!user) return;
  try {
    await user.getIdToken(true);
  } catch (e) {
    console.warn("⚠️ Token invalide — déconnexion forcée");
    try { await signOut(auth); } catch {}
    clearLocalSession();
  }
});

/* ---------- EXPORTS ---------- */
window.clearLocalSession = clearLocalSession;
window.forceLogoutAndClear = forceLogoutAndClear;

export { app, auth, db, storage, clearLocalSession, forceLogoutAndClear };
